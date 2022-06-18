type Props = {
  onSubmit: (e: React.FormEvent) => void;
};

export const ConnectionForm = ({ onSubmit }: Props) => {
  return (
    <form className="pt-8 px-4 sm:px-10" onSubmit={onSubmit}>
      <label
        htmlFor="name"
        className="block text-sm font-medium text-slate-700"
      >
        Search Connections
      </label>
      <div className="mt-1 relative flex items-center">
        <input
          type="text"
          name="name"
          id="name"
          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-12 sm:text-sm border-slate-300 rounded-md"
          autoFocus
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <button type="submit">
            <kbd className="inline-flex items-center border border-slate-200 rounded px-2 text-sm font-sans font-medium text-slate-400 transition hover:bg-slate-100">
              Enter
            </kbd>
          </button>
        </div>
      </div>
    </form>
  );
};
