import { Typography } from '@mui/material';

const TitleHeader = ({ title }: { title: string }) => {
  return (
    <div className='flex flex-col items-center justify-center bg-gray-100'>
      <div className='flex h-[200px] items-center justify-center'>
        <Typography variant="h5">
          {title.toUpperCase()}
        </Typography>
      </div>
    </div>
  );
};

export default TitleHeader;