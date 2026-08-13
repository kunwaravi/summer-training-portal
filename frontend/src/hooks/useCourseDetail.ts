import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export const useCourseDetail = (courseId: string | undefined) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progressInfo = user?.progresses?.find((p: any) => p.courseId === courseId);
  const currentWeek = progressInfo?.weekCompleted || 0;

  // Mirror progress into a ref so the syllabus fetch depends only on courseId.
  // Progress changes (e.g. the user's own quiz completion triggering a user
  // refresh) must NOT re-trigger fetchSyllabus — that re-clamps activeWeekIndex
  // and jumps the student to a different week mid-session (M-048).
  const currentWeekRef = useRef(currentWeek);
  useEffect(() => {
    currentWeekRef.current = currentWeek;
  });

  const fetchSyllabus = useCallback(async () => {
    if (!courseId) return;
    setLoadingSyllabus(true);
    setError(null);
    try {
      const res = await api.get('/courses');
      // Find the specific course in the returned array
      const matchedCourse = res.data.find((c: any) => c.id === courseId);
      setCourse(matchedCourse);
      const courseWeeks = matchedCourse?.modules || [];
      setWeeks(courseWeeks);

      const savedIndex = localStorage.getItem(`last_viewed_week_${courseId}`);
      const activeIndex = savedIndex !== null
        ? Math.min(parseInt(savedIndex, 10), Math.max(0, courseWeeks.length - 1))
        : Math.min(currentWeekRef.current, Math.max(0, courseWeeks.length - 1));
      setActiveWeekIndex(activeIndex);
    } catch (err: any) {
      console.error('Failed to fetch course syllabus:', err);
      setError(err?.response?.data?.message || 'Failed to load course content. Please try again.');
    } finally {
      setLoadingSyllabus(false);
    }
  }, [courseId]);

  const fetchPaymentStatus = useCallback(async () => {
    if (!courseId || !user) return;
    setCheckingPayment(true);
    try {
      const res = await api.get(`/payments/status/${courseId}`);
      setIsPaid(res.data.paid);
    } catch (err) {
      console.error('Failed to fetch payment status:', err);
    } finally {
      setCheckingPayment(false);
    }
  }, [courseId, user]);

  // Abort any in-flight module request when the active week changes so a stale
  // response can never overwrite the current week's content (M-048 race fix).
  const moduleAbortRef = useRef<AbortController | null>(null);

  const fetchModuleDetails = useCallback(async () => {
    if (!courseId || weeks.length === 0) return;
    moduleAbortRef.current?.abort();
    const controller = new AbortController();
    moduleAbortRef.current = controller;
    setLoadingDetails(true);
    try {
      const activeWeekNum = weeks[activeWeekIndex]?.week || (activeWeekIndex + 1);
      const res = await api.get(`/courses/${courseId}/module/${activeWeekNum}`, {
        signal: controller.signal
      });
      setActiveModuleDetail(res.data);
    } catch (err: any) {
      // Superseded by a newer request (or unmount) — ignore; a fallback here
      // would show the wrong week's content.
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
      console.error('Lazy loading module failed, utilizing fallback dataset:', err);
      setActiveModuleDetail(weeks[activeWeekIndex]);
    } finally {
      // Only the latest controller is allowed to clear the loading flag.
      if (moduleAbortRef.current === controller) {
        setLoadingDetails(false);
      }
    }
  }, [courseId, weeks, activeWeekIndex]);

  useEffect(() => {
    fetchSyllabus();
  }, [fetchSyllabus]);

  useEffect(() => {
    fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  // Cancel any in-flight module request when the hook unmounts.
  useEffect(() => () => moduleAbortRef.current?.abort(), []);

  const refreshPaymentStatus = () => {
    fetchPaymentStatus();
  };

  const setPersistedActiveWeekIndex = (index: number) => {
    setActiveWeekIndex(index);
    if (courseId) {
      localStorage.setItem(`last_viewed_week_${courseId}`, index.toString());
    }
  };

  return {
    course,
    weeks,
    activeWeekIndex,
    setActiveWeekIndex: setPersistedActiveWeekIndex,
    loadingSyllabus,
    loadingDetails,
    activeModuleDetail,
    isPaid,
    checkingPayment,
    currentWeek,
    error,
    refetchSyllabus: fetchSyllabus,
    refreshPaymentStatus
  };
};
