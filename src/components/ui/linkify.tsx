import BaseLinkify from "linkify-react";

const linkifyOptions = {
  className: "text-blue-400 hover:text-blue-500",
};

export const Linkify = (props: React.ComponentProps<typeof BaseLinkify>) => {
  return <BaseLinkify options={linkifyOptions} {...props} />;
};
