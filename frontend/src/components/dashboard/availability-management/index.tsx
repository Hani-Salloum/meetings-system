'use client'

import { useState, useEffect, useRef } from 'react';
import { Client } from '@/configs/api';
import { Loader2 } from 'lucide-react';
import AvailabilityGrid from './availability-grid';
import { EmployeeAvailability, UserData } from './types';
import { useTranslations } from 'next-intl';

interface AvailabilityManagementProps {
  id: number;
  disabled: boolean;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const AvailabilityManagement = ({ id, disabled }: AvailabilityManagementProps) => {
  const t = useTranslations()

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHours, setSelectedHours] = useState<Record<string, Set<number>>>({});
  const [shiftStart, setShiftStart] = useState<{ day: string; hour: number } | null>(null);
  const isShiftPressed = useRef(false);

  useEffect(() => {
    const initSelected: Record<string, Set<number>> = {};
    DAYS.forEach(day => {
      initSelected[day] = new Set();
    });

    userData?.employeesAvailability.forEach(avail => {
      avail.day_parts.forEach(part => {
        const hour = parseInt(part.replace('HOUR_', ''));
        initSelected[avail.week_day].add(hour);
      });
    });

    setSelectedHours(initSelected);
  }, [userData]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await Client.admin().get(`/admin/availability/user/${id}`);
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) isShiftPressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        isShiftPressed.current = false;
        setShiftStart(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const findAvailabilityByDay = (day: string) => {
    return userData?.employeesAvailability.find(avail => avail.week_day === day);
  };

  const updateAvailability = async (day: string, hours: number[]) => {
    const existing = findAvailabilityByDay(day);
    const dayParts = hours.map(h => `HOUR_${h}`);

    try {
      if (existing) {
        await Client.admin().put(`/admin/availability/${existing.id}`, { day_parts: dayParts });
      } else {
        await Client.admin().post('/admin/availability/', {
          user_id: id,
          week_day: day,
          day_parts: dayParts
        });
      }
      await fetchAvailability();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const toggleHoursInSet = (daySet: Set<number>, hours: number[]): Set<number> => {
    const newSet = new Set(daySet);
    hours.forEach(hour => {
      if (newSet.has(hour)) {
        newSet.delete(hour);
      } else {
        newSet.add(hour);
      }
    });
    return newSet;
  };

  const updateHours = (day: string, hoursToToggle: number[]) => {
    setSelectedHours(prev => ({
      ...prev,
      [day]: toggleHoursInSet(prev[day] || new Set(), hoursToToggle)
    }));

    const finalHours = toggleHoursInSet(selectedHours[day] || new Set(), hoursToToggle);
    updateAvailability(day, Array.from(finalHours).sort((a, b) => a - b));
  };

  const handleHourClick = (day: string, hour: number) => {
    if (disabled) return;

    if (isShiftPressed.current && shiftStart && shiftStart.day === day) {
      const start = Math.min(shiftStart.hour, hour);
      const end = Math.max(shiftStart.hour, hour);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      updateHours(day, range);
      setShiftStart(null);
    } else if (isShiftPressed.current) {
      setShiftStart({ day, hour });
    } else {
      updateHours(day, [hour]);
    }
  };

  const isHourSelected = (day: string, hour: number) => {
    return selectedHours[day]?.has(hour) || false;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('Availability Management')}</h2>
        {loading && (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        )}
      </div>

      <AvailabilityGrid
        days={DAYS}
        disabled={disabled}
        isHourSelected={isHourSelected}
        onHourClick={handleHourClick}
      />

      <div className="mt-6 text-sm text-gray-600 space-y-1">
        <p>{t('ClickToggleAvailability')}</p>
        <p>{t('HoldShift')}</p>
      </div>
    </div>
  );
};

export default AvailabilityManagement;