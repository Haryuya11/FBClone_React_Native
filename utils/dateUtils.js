
import {useContext} from 'react';
import { UserContext } from '../context/UserContext';

export const formatTimeAgo = (createdAt) => {
  const { language } = useContext(UserContext);

  const now = new Date();
  const created = new Date(createdAt);
  const diffInMilliseconds = now - created;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  const translations = {
    vi: {
      justNow: 'Vừa xong',
      minutesAgo: 'phút trước',
      hoursAgo: 'giờ trước',
      daysAgo: 'ngày trước',
      weeksAgo: 'tuần trước',
      monthsAgo: created.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    },
    en: {
      justNow: 'Just now',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago',
      daysAgo: 'days ago',
      weeksAgo: 'weeks ago',
      monthsAgo: created.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    },
  };

  const t = translations[language] || translations.vi; 

  if (diffInMonths > 0) {
    return t.monthsAgo;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} ${t.weeksAgo}`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ${t.daysAgo}`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${t.hoursAgo}`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} ${t.minutesAgo}`;
  } else {
    return t.justNow;
  }
};