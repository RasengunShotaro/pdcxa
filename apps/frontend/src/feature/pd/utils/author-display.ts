interface 著者の名前を決めるInput {
  userFullName: string;
  userName: string;
}

interface 著者の名前 {
  name: string;
  handle: string | null;
}

export const 著者の名前を決める = ({
  userFullName,
  userName,
}: 著者の名前を決めるInput): 著者の名前 => {
  const fullName = userFullName.trim();
  if (fullName) {
    return { name: fullName, handle: userName || null };
  }
  if (userName) {
    return { name: `@${userName}`, handle: null };
  }
  return { name: "名称未設定", handle: null };
};
