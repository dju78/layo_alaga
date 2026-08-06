interface StatusProps {
  status: string;
}

export function BookingStatusBadge({ status }: StatusProps) {
  let bgClass = 'bg-[#EAF2FC] text-[#3765A3]'; // Info default
  let label = status;

  switch (status) {
    case 'ENQUIRY_RECEIVED':
      bgClass = 'bg-[#EAF2FC] text-[#3765A3]';
      label = 'Enquiry Received';
      break;
    case 'AWAITING_REVIEW':
      bgClass = 'bg-[#FFF4DF] text-[#A66514]';
      label = 'Awaiting Review';
      break;
    case 'AWAITING_QUOTATION':
      bgClass = 'bg-[#FFF4DF] text-[#A66514]';
      label = 'Awaiting Quotation';
      break;
    case 'QUOTATION_SENT':
      bgClass = 'bg-[#F1E8F4] text-[#652278]';
      label = 'Quotation Sent';
      break;
    case 'CUSTOMER_REQUESTED_CHANGES':
      bgClass = 'bg-[#FAEAF0] text-[#B84C73]';
      label = 'Changes Requested';
      break;
    case 'AWAITING_DEPOSIT':
      bgClass = 'bg-[#FFF4DF] text-[#A66514]';
      label = 'Awaiting Deposit';
      break;
    case 'BOOKING_CONFIRMED':
      bgClass = 'bg-[#E7F5EE] text-[#247A52]';
      label = 'Booking Confirmed';
      break;
    case 'PREPARATION_IN_PROGRESS':
      bgClass = 'bg-[#F1E8F4] text-[#7B328F]';
      label = 'Preparation in Progress';
      break;
    case 'EVENT_COMPLETED':
      bgClass = 'bg-gray-100 text-gray-700';
      label = 'Event Completed';
      break;
    case 'CANCELLED':
      bgClass = 'bg-[#FDEBEC] text-[#B83B42]';
      label = 'Cancelled';
      break;
    default:
      label = status.replace(/_/g, ' ');
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: StatusProps) {
  let bgClass = 'bg-gray-100 text-gray-700';
  let label = status;

  switch (status) {
    case 'SUCCESSFUL':
      bgClass = 'bg-[#E7F5EE] text-[#247A52]';
      label = 'Paid / Successful';
      break;
    case 'PENDING':
      bgClass = 'bg-[#FFF4DF] text-[#A66514]';
      label = 'Pending Verification';
      break;
    case 'FAILED':
      bgClass = 'bg-[#FDEBEC] text-[#B83B42]';
      label = 'Failed';
      break;
    case 'REFUNDED':
      bgClass = 'bg-purple-100 text-purple-800';
      label = 'Refunded';
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgClass}`}>
      {label}
    </span>
  );
}
