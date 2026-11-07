export interface MeetingRequest {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  description: string;
  pathname: string;
  preferred_date: string;
  guest_attendees?: string[];
}

export interface MeetingRequestResponse {
  success: boolean;
  data: {
    meetingId: number;
    clientId: number;
    status: string;
    message: string;
  };
}

export interface MeetingRequestError {
  success: boolean;
  message: string;
}
