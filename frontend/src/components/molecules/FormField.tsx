import React from 'react';
import Input from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  ...props
}) => {
  return (
    <Input
      label={label}
      error={error}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      containerClassName={containerClassName}
      {...props}
    />
  );
};

export default FormField;
