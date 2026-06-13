import React from 'react';
import styles from './css.module/Table.module.css';

export interface TableColumn<T> {
  key: string;
  title: string;
  render: (item: T) => React.ReactNode;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  className?: string;
}

export const Table = <T,>({
  columns,
  data,
  keyExtractor,
  className = '',
}: TableProps<T>) => {
  return (
    <table className={`${styles.table} ${className}`}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{ textAlign: column.headerAlign || 'left' }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={keyExtractor(item)}>
            {columns.map((column) => (
              <td
                key={column.key}
                style={{ textAlign: column.align || 'left' }}
              >
                {column.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
