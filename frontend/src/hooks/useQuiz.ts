import { useState, useCallback, useEffect } from 'react';
import api from '../api';

export const useQuiz = (courseId?: string, week?: string | number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!courseId || !week) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/quiz/questions/${courseId}/${week}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  }, [courseId, week]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const submitQuiz = async (userId: string | number, answers: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/quiz/submit', {
        userId,
        courseId,
        week,
        answers
      });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to submit quiz';
      setError(errMsg);
      throw new Error(errMsg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchQuiz, submitQuiz };
};
