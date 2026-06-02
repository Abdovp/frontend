import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { id, label, error, hint, inputProps },
  ref
) {
  const hasError = Boolean(error);
  const inputClass = inputProps?.dir === 'ltr' ? 'field-input-tel' : 'field-input';

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClass}${hasError ? ' field-input--error' : ''}`}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default FormField;
