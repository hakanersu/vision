import { ComponentType } from "react";
import Form from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";

// Custom field template
const FieldTemplate = (props: any) => {
  const { id, classNames, label, help, required, description, errors, children } = props;
  return (
    <div className={`space-y-2 ${classNames}`}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (typeof description !== "string" || description.trim()) && (<p className="text-sm text-muted-foreground">{description}</p>)}
      {children}
      {errors && errors.length > 0 && (
        <div className="text-sm font-medium text-destructive">
          {errors.map((error: string, index: number) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {help && <p className="text-sm text-muted-foreground">{help}</p>}
    </div>
  );
};

// Custom widgets
const TextWidget = (props: any) => {
  const { id, placeholder, required, disabled, readonly, value, onChange, onBlur, onFocus, label, schema } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === "" ? undefined : event.target.value;
    onChange(newValue);
  };

  return (
    <Input
      id={id}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      value={value || ""}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      type={schema.type === "number" ? "number" : "text"}
    />
  );
};

const TextareaWidget = (props: any) => {
  const { id, placeholder, required, disabled, readonly, value, onChange, onBlur, onFocus } = props;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value === "" ? undefined : event.target.value;
    onChange(newValue);
  };

  return (
    <Textarea
      id={id}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      value={value || ""}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      rows={3}
    />
  );
};

const NumberWidget = (props: any) => {
  const { id, placeholder, required, disabled, readonly, value, onChange, onBlur, onFocus } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === "" ? undefined : Number(event.target.value);
    onChange(newValue);
  };

  return (
    <Input
      id={id}
      type="number"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      value={value || ""}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

// Custom submit button
const SubmitButton = (props: any) => {
  return (
    <Button type="submit" disabled={props.disabled} className="w-full">
      {props.children || "Submit"}
    </Button>
  );
};

// Theme configuration
const theme = {
  templates: {
    FieldTemplate,
    ButtonTemplates: {
      SubmitButton,
    },
  },
  widgets: {
    TextWidget,
    TextareaWidget: TextareaWidget,
    NumberWidget,
  },
};

interface JsonSchemaFormProps {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: any;
  onSubmit: (data: any) => void;
  onChange?: (data: any) => void;
  onError?: (errors: any) => void;
  submitText?: string;
  disabled?: boolean;
}

export function JsonSchemaForm({
  schema,
  uiSchema = {},
  formData,
  onSubmit,
  onError,
  onChange,
  submitText = "Submit",
  disabled = false,
}: JsonSchemaFormProps) {
  const handleSubmit = (data: any) => {
    onSubmit(data.formData);
  };

  const handleOnChange = (data: any) => {
    onChange && onChange(data.formData);
  }


  const handleError = (errors: any) => {
    if (onError) {
      onError(errors);
    }
  };

  return (
    <Form
      schema={schema}
      uiSchema={{
        ...uiSchema,
        "ui:submitButtonOptions": {
          submitText,
          norender: false,
          props: {
            disabled,
            className: "w-full",
          },
        },
      }}
      formData={formData}
      validator={validator}
      onSubmit={handleSubmit}
      onError={handleError}
      onChange={handleOnChange}
      {...theme}
    />
  );
}

export default JsonSchemaForm;
