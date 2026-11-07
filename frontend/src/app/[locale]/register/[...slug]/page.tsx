import { transformGroupAvailabilities } from "@/components/meeting-datepicker/functions";
import RegisterForMeeting from "@/components/register";
import { Client } from "@/configs/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register for meeting",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const getData = async (slug: string) => {
  const res = await Client.noAuth.get(`/customer/${slug}`);
  return res.data;
};

export default async function PollAnswerAuthPage({ params }: Props) {
  const { slug } = await params;

  const data = (await getData(slug)) || {
    title: "",
    pathname: "",
    description: "",
    duration: 0,
    maximum_attendees: 0,
    groupCommonAvailabilities: [],
  };

  const pageData = data.groupCommonAvailabilities.length > 0 ? {...data, groupCommonAvailabilities: transformGroupAvailabilities(data.groupCommonAvailabilities)  } : data

  return (
    <div>
      <RegisterForMeeting pageData={pageData} />
    </div>
  );
}
