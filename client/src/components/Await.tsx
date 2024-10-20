const Await = async ({ promise, children }: {
  promise: Promise<any>,
  children: (value: any) => JSX.Element
}) => {
  let resolvedData = await promise;
  return children(resolvedData);
};

export default Await;