import { Table, TableColumn } from '../atoms';
import { useTranslation } from 'react-i18next';
import styles from './css.module/DataTable.module.css';

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  className?: string;
}

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  loading = false,
  className = '',
}: DataTableProps<T>) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={`${styles.content} ${className}`}>
        <div className={styles.loading}>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.content} ${className}`}>
      <Table columns={columns} data={data} keyExtractor={keyExtractor} />

      {onPageChange && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <span>{t('common.rowsPerPage')}:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className={styles.pageSizeSelect}
            >
              <option value={10}>10</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
          <div className={styles.paginationControls}>
            <button
              className={`${styles.pageButton} ${currentPage === 1 ? styles['pageButton--disabled'] : ''}`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t('common.previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles['pageButton--active'] : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`${styles.pageButton} ${currentPage === totalPages ? styles['pageButton--disabled'] : ''}`}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t('common.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
