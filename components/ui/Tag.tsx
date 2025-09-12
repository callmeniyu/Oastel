type TagProps = {
  tag: string;
};
const Tag = ({ tag }: TagProps) => {
  return (
    <div className="px-1 py-2 bg-primary_green-light text-primary_green rounded-md">
      <p className="font-poppins font-medium text-[12px]">{tag}</p>
    </div>
  );
};

export default Tag;
