export const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5 className="pb-1 text-heading5 text-neutralGreen-900">{title}</h5>
      {subtitle && <p className="text-body5 text-neutral-600">{subtitle}</p>}
      <hr />
    </div>
  );
};

export const FormFieldWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col gap-6">{children}</div>;
};
