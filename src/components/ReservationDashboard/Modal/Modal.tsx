import { useEffect, useState } from 'react';
import clsx from 'clsx';

import ModalLayout from '@/components/Modal/ModalLayout/ModalLayout';
import ModalContent from '@/components/ReservationDashboard/Modal/ModalContent';
import { CALENDAR_MODAL_MAP, STATUS_ARR } from '@/constants/calendar';
import { DailyReservationStatusCount } from '@/types/common/api';
import { formatDateStringByDot } from '@/utils/ReservationDashboard/formatDateStringByDot';
import { useQuery } from '@tanstack/react-query';
import { getReservedSchedule } from '@/api/myActivities';
import QUERY_KEYS from '@/constants/queryKeys';
import CloseIcon from '#/icons/icon-close.svg';
import styles from './Modal.module.css';

interface ModalProps {
  handleModalClose: () => void;
  date: string;
  activityId: number;
}

interface ModalTabProps {
  handleStatus: (val: keyof DailyReservationStatusCount) => void;
  tabStatus: string;
  item: DailyReservationStatusCount | undefined;
}

function Modal({ handleModalClose, date, activityId }: ModalProps) {
  const [year, month, day] = date.split('-').map(Number);
  const { data: dailyReservationData, refetch: dailyReservationRefetch } = useQuery({
    queryKey: [QUERY_KEYS.dailyReservation, formatDateStringByDot({ year, month, day, padStart: true })],
    queryFn: () =>
      getReservedSchedule({ activityId, date: formatDateStringByDot({ year, month, day, padStart: true }) }),
  });
  const INITIAL_DROPDOWN_ITEM = {
    id: dailyReservationData ? dailyReservationData[0].scheduleId : 0,
    title: dailyReservationData ? `${dailyReservationData[0].startTime} ~ ${dailyReservationData[0].endTime}` : '0',
  };
  const [dropdownItem, setDropdownItem] = useState(INITIAL_DROPDOWN_ITEM);
  const [tabStatus, setTabStatus] = useState<keyof DailyReservationStatusCount>('pending');

  const handleStatus = (status: keyof DailyReservationStatusCount) => {
    setTabStatus(status);
  };

  useEffect(() => {
    dailyReservationRefetch();
  }, [dropdownItem]);

  const tabCount = dailyReservationData?.find((item) => item.scheduleId === dropdownItem.id)?.count;

  useEffect(() => {
    if (dailyReservationData)
      setDropdownItem({
        id: dailyReservationData[0].scheduleId,
        title: `${dailyReservationData[0].startTime} ~ ${dailyReservationData[0].endTime}`,
      });
  }, [dailyReservationData]);

  if (!dailyReservationData) return null;
  console.log(dailyReservationData, tabCount);

  return (
    <ModalLayout handleModalClose={handleModalClose}>
      <div className={styles.container}>
        <ModalHeader handleModalClose={handleModalClose} />
        <ModalTab handleStatus={handleStatus} tabStatus={tabStatus} item={tabCount} />
        <ModalContent
          setDropdownItem={setDropdownItem}
          items={dailyReservationData!}
          dropdownItem={dropdownItem}
          date={date}
          tabStatus={tabStatus}
          activityId={activityId}
          handleModalClose={handleModalClose}
        />
      </div>
    </ModalLayout>
  );
}

function ModalHeader({ handleModalClose }: Pick<ModalProps, 'handleModalClose'>) {
  return (
    <div className={styles.header}>
      <h1>예약 정보</h1>
      <button>
        <CloseIcon alt="닫기" onClick={handleModalClose} />
      </button>
    </div>
  );
}

function ModalTab({ handleStatus, tabStatus, item }: ModalTabProps) {
  const [tabItem, setTabItem] = useState(item);

  useEffect(() => {
    setTabItem(item);
  }, [item]);
  if (!tabItem) return null;
  return (
    <div className={styles.tabWrapper}>
      <div className={styles.stroke}></div>
      {STATUS_ARR.map((status, index) => (
        <div className={styles.tabInnerWrapper} key={index}>
          <div className={styles.tab} onClick={() => handleStatus(status)}>
            <span className={clsx(status === tabStatus ? styles.tabTextEnabled : styles.tabTextDisabled)}>
              {CALENDAR_MODAL_MAP[status]}
            </span>
            <span className={clsx(status === tabStatus ? styles.tabTextEnabled : styles.tabTextDisabled)}>
              {tabItem[status]}
            </span>
            {status === tabStatus && <div className={styles.tabEnabledStroke}></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Modal;
