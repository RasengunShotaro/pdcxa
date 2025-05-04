import BaseLinkify from "linkify-react";

const linkifyOptions = {
  className: "text-primary hover:underline",
};

export const Linkify = (props: React.ComponentProps<typeof BaseLinkify>) => {
  return <BaseLinkify options={linkifyOptions} {...props} />;
};
