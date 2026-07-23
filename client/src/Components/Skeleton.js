import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CardSkeleton = () => (
  <div className="card">
    {/* Image Placeholder */}
    <Skeleton height={200} width="100%" borderRadius={8} />
    
    <div className="content" style={{ padding: '16px' }}>
      {/* Title */}
      <Skeleton height={24} width="70%" style={{ marginBottom: '12px' }} />
      
      {/* Description Lines */}
      <Skeleton count={3} style={{ marginBottom: '8px' }} />
      
      {/* Action Button Placeholder */}
      <Skeleton height={36} width={100} borderRadius={4} style={{ marginTop: '16px' }} />
    </div>
  </div>
);