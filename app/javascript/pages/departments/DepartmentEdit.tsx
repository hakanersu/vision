import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";

import Form from "@rjsf/shadcn";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { FormEventHandler, useEffect } from "react";

import { IChangeEvent } from "@rjsf/core";
import { ErrorSchemaBuilder, ErrorSchema } from "@rjsf/utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Departmanlar",
    href: "/deparments",
  },
];

const schema: RJSFSchema = {
  title: "Departman ekleme formu",
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
      title: "Department name",
      default: "IT",
    },
  },
};
type DepartmentForm = {
  name: string;
};

const log = (type: any) => console.log.bind(console, type);

export default function DepartmentIndex() {
  const { department } = usePage<{ department: DepartmentForm }>().props;
  const { data, setData, post, reset, errors, processing, recentlySuccessful } =
    useForm<Required<DepartmentForm>>({
      name: department.name || "",
    });

  console.log(data);
  const builder = new ErrorSchemaBuilder();
  if (errors && errors.name) {
    builder.addErrors(errors.name, "name");
  }
  const submit = (e: IChangeEvent<DepartmentForm>) => {
    post("/departments", {
      preserveScroll: true,
      onFinish: () => reset("name"),
    });
  };

  return (
    <>
      <Head title="Departmanlar" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Departmanlar</h1>
        <Form
          className="space-y-4"
          schema={schema}
          validator={validator}
          onChange={(e) => setData(e.formData)}
          formData={data}
          onSubmit={submit}
          onError={log("errors")}
          extraErrors={builder.ErrorSchema}
          disabled={processing}
        />
      </div>
    </>
  );
}