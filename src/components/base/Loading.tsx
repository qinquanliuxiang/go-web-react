interface LoadingProps {
  loading: boolean;
}

const LoadingComponent = ({ loading }: LoadingProps) => {
  if (loading) {
    return <div className="text-[18px] m-3">Loading...</div>;
  }
};

export default LoadingComponent;
