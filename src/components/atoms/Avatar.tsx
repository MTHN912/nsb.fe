import React from 'react';
import styles from './css.module/Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
}) => {
  const avatarClasses = [
    styles.avatar,
    styles[`avatar--${size}`],
    className,
  ].filter(Boolean).join(' ');

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={avatarClasses}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
