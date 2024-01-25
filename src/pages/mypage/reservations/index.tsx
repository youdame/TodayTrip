import DropDown from '@/components/Reservations/DropDown/DropDown';
import styles from './Reservations.module.css';
import { useState } from 'react';
import Card, { CardProps } from '@/components/Reservations/Card/Card';
function Reservation() {
  const [isDropdownView, setDropdownView] = useState(false);

  const handleClickContainer = () => {
    setDropdownView(!isDropdownView);
  };

  const handleBlurContainer = () => {
    setTimeout(() => {
      setDropdownView(false);
    }, 200);
  };

  const reservations: CardProps['data'][] = [
    {
      id: 1,
      activity: {
        bannerImageUrl: '/images/nextjs.png',
        title: '함께 배우면 즐거운 스트릿 댄스',
        id: 101,
      },
      scheduleId: 201,
      status: 'pending',
      reviewSubmitted: true,
      totalPrice: 10000,
      headCount: 10,
      date: '2024-03-10',
      startTime: '09:00',
      endTime: '12:00',
    },
    {
      id: 2,
      activity: {
        bannerImageUrl: '/images/flower.png',
        title: 'Culinary Tour',
        id: 202,
      },
      scheduleId: 303,
      status: 'confirmed',
      reviewSubmitted: false,
      totalPrice: 20000,
      headCount: 2,
      date: '2024-03-15',
      startTime: '18:30',
      endTime: '21:30',
    },
    {
      id: 3,
      activity: {
        bannerImageUrl: '/images/react.png',
        title: 'Mountain Biking',
        id: 303,
      },
      scheduleId: 404,
      status: 'declined',
      reviewSubmitted: false,
      totalPrice: 3000,
      headCount: 1,
      date: '2024-03-20',
      startTime: '14:00',
      endTime: '16:00',
    },
    {
      id: 4,
      activity: {
        bannerImageUrl: '/images/react.png',
        title: 'Beach Picnic',
        id: 404,
      },
      scheduleId: 505,
      status: 'canceled',
      reviewSubmitted: false,
      totalPrice: 40000,
      headCount: 4,
      date: '2024-03-25',
      startTime: '12:00',
      endTime: '15:00',
    },
    {
      id: 5,
      activity: {
        bannerImageUrl: '/images/react.png',
        title: 'City Sightseeing',
        id: 505,
      },
      scheduleId: 606,
      status: 'completed',
      reviewSubmitted: true,
      totalPrice: 50000,
      headCount: 2,
      date: '2024-03-30',
      startTime: '10:00',
      endTime: '16:00',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '3rem',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.h2}>예약 내역</h2>
          <div className="container" onBlur={handleBlurContainer}>
            <label onClick={handleClickContainer}>
              <button>예약 상태{isDropdownView ? '▲' : '▼'}</button>
              {isDropdownView && (
                <ul>
                  {['예약 완료', '예약 취소', '예약 승인', '예약 거절', '체험 완료'].map((li, i) => (
                    <li
                      style={{
                        zIndex: '1',
                        display: 'flex',
                        width: '5rem',
                        height: '3rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      key={i}
                    >
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </label>
          </div>
        </div>
        {reservations.map((reservation) => (
          <Card key={reservation.id} data={reservation} />
        ))}
      </div>
    </div>
  );
}

export default Reservation;
