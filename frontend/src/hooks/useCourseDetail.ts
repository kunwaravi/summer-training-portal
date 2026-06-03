import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const useCourseDetail = (courseId: string | undefined) => {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState<any[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

  const progressInfo = user?.progresses?.find((p: any) => p.courseId === courseId);
  const currentWeek = progressInfo?.weekCompleted || 0;

  const fetchSyllabus = useCallback(async () => {
    if (!courseId) return;
    setLoadingSyllabus(true);
    try {
      const res = await api.get('/courses');
      // Find the specific course in the returned array
      const course = res.data.find((c: any) => c.id === courseId);
      const courseWeeks = course?.modules || [];
      setWeeks(courseWeeks);
      
      const activeIndex = Math.min(currentWeek, 3);
      setActiveWeekIndex(activeIndex);
    } catch (err) {
      console.error('Failed to fetch course syllabus:', err);
    } finally {
      setLoadingSyllabus(false);
    }
  }, [courseId, currentWeek]);

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

  const fetchModuleDetails = useCallback(async () => {
    if (!courseId || weeks.length === 0) return;
    setLoadingDetails(true);
    try {
      const activeWeekNum = weeks[activeWeekIndex]?.week || (activeWeekIndex + 1);
      const res = await api.get(`/courses/${courseId}/module/${activeWeekNum}`);
      setActiveModuleDetail(res.data);
    } catch (err) {
      console.error('Lazy loading module failed, utilizing fallback dataset:', err);
      setActiveModuleDetail(weeks[activeWeekIndex]);
    } finally {
      setLoadingDetails(false);
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

  const refreshPaymentStatus = () => {
    fetchPaymentStatus();
  };

  return {
    weeks,
    activeWeekIndex,
    setActiveWeekIndex,
    loadingSyllabus,
    loadingDetails,
    activeModuleDetail,
    isPaid,
    checkingPayment,
    currentWeek,
    refreshPaymentStatus,
    setIsPaid
  };
};
