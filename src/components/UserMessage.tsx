interface Props {
  content: string;
}

export function UserMessage({ content }: Props) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--color-primary)] px-4 py-2.5 text-[15px] leading-relaxed text-white sm:max-w-[75%]">
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  );
}
