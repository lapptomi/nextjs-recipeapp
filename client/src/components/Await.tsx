const Await = async ({
  promise,
  children,
}: {
  promise: Promise<any>;
  children: ({ data, error }: { data: any; error?: string }) => JSX.Element;
}) => {
  try {
    const resolvedData = await promise;
    return children({ data: resolvedData });
  } catch (error: any) {
    return children({ data: [], error: error.message });
  }
};

export default Await;
