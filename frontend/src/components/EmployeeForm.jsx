import { useEffect, useState } from "react";
import { Save } from "lucide-react";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  hireDate: "",
  basicSalary: "",
  status: "Active",
  department: "",
  jobTitle: ""
};

const departments = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Support"];
const inputClass = "mt-1.5 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20";

function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address";
  if (!/^\d{10,15}$/.test(values.phone)) errors.phone = "Phone must contain 10 to 15 digits";
  if (!values.hireDate) errors.hireDate = "Hire date is required";
  else if (values.hireDate > new Date().toISOString().slice(0, 10)) errors.hireDate = "Hire date cannot be in the future";
  if (values.basicSalary === "" || !Number.isFinite(Number(values.basicSalary)) || Number(values.basicSalary) < 0) {
    errors.basicSalary = "Salary must be at least 0";
  }
  if (!["Active", "On Leave", "Resigned"].includes(values.status)) errors.status = "Choose a valid status";
  return errors;
}

export default function EmployeeForm({ employee, onSubmit, onCancel, submitting = false }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    setValues(employee ? {
      ...emptyForm,
      ...employee,
      hireDate: employee.hireDate || "",
      basicSalary: employee.basicSalary ?? ""
    } : emptyForm);
    setErrors({});
    setServerMessage("");
  }, [employee]);

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setServerMessage("");
    if (Object.keys(validationErrors).length) return;

    const payload = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      basicSalary: Number(values.basicSalary),
      department: values.department || null,
      jobTitle: values.jobTitle.trim() || null
    };
    try {
      await onSubmit(payload);
    } catch (error) {
      const response = error.response;
      const fieldErrors = response?.data?.errors;
      if (response?.status === 400 && fieldErrors && Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
        setServerMessage("Please correct the highlighted fields.");
      } else {
        setServerMessage(response?.data?.message || "Could not save this employee. Please try again.");
      }
    }
  }

  function field(name, label, options = {}) {
    return (
      <label className="block min-w-0 text-sm font-medium text-slate-700 dark:text-slate-300" key={name}>
        {label}{options.required && <span className="text-rose-500"> *</span>}
        {options.select ? (
          <select name={name} value={values[name]} onChange={change} className={inputClass} aria-invalid={Boolean(errors[name])}>
            {options.select.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : (
          <input
            name={name}
            type={options.type || "text"}
            value={values[name]}
            onChange={change}
            className={inputClass}
            placeholder={options.placeholder}
            min={options.min}
            max={options.max}
            step={options.step}
            aria-invalid={Boolean(errors[name])}
          />
        )}
        {errors[name] && <span className="mt-1 block text-xs font-normal text-rose-600 dark:text-rose-400">{errors[name]}</span>}
      </label>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">Fields marked * are required.</p>
      {serverMessage && <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{serverMessage}</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { required: true })}
        {field("lastName", "Last name", { required: true })}
        {field("email", "Email address", { required: true, type: "email", placeholder: "name@company.com" })}
        {field("phone", "Phone", { required: true, type: "tel", placeholder: "10–15 digits" })}
        {field("hireDate", "Hire date", { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}
        {field("basicSalary", "Basic salary (INR)", { required: true, type: "number", min: "0", step: "0.01", placeholder: "0" })}
        {field("status", "Status", { required: true, select: [
          { value: "Active", label: "Active" },
          { value: "On Leave", label: "On Leave" },
          { value: "Resigned", label: "Resigned" }
        ] })}
        {field("department", "Department", { select: [
          { value: "", label: "Select department" },
          ...departments.map((department) => ({ value: department, label: department }))
        ] })}
        {field("jobTitle", "Job title", { placeholder: "e.g. Product Designer" })}
      </div>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
          <Save className="h-4 w-4" />{submitting ? "Saving..." : "Save employee"}
        </button>
      </div>
    </form>
  );
}
