import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = ({
  imageUrl,
  userFullName,
}: {
  imageUrl: string;
  userFullName: string;
}) => {
  const params = new URLSearchParams();
  params.set("height", "200");
  params.set("width", "200");
  params.set("quality", "100");
  params.set("fit", "crop");

  const imageSrc = `${imageUrl}?${params.toString()}`;

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={imageSrc} alt={userFullName} />
      <AvatarFallback>{userFullName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
