import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from '../atoms';
import { LogOut } from 'lucide-react';
import styles from './css.module/LogoutConfirmationModal.module.css';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('logout.confirmTitle')}
      footer={
        <div className={styles.footer}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('logout.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            <LogOut size={18} className={styles.buttonIcon} />
            {t('logout.confirm')}
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <LogOut size={48} className={styles.icon} />
        </div>
        <p className={styles.message}>{t('logout.confirmMessage')}</p>
      </div>
    </Modal>
  );
};
