import { useSelector } from "react-redux";
import parse from "html-react-parser";

const Policies = () => {
  const { hotelInfo } = useSelector((state: any) => state.hotelInfo);

  const policyContent = [
    {
      id: 1,
      isShown: hotelInfo?.terms_and_cond !== "",
      policy_name: "Terms and Conditions",
      policy_content: hotelInfo?.terms_and_cond,
    },
    {
      id: 2,
      isShown: hotelInfo?.cancel_policy !== "",
      policy_name: "Cancellation Policy",
      policy_content: hotelInfo?.cancel_policy,
    },
    {
      id: 3,
      isShown: hotelInfo?.child_policy !== "",
      policy_name: "Child Policy",
      policy_content: hotelInfo?.child_policy,
    },
    {
      id: 4,
      isShown: hotelInfo?.hotel_policy !== "",
      policy_name: "Hotel Policy",
      policy_content: hotelInfo?.hotel_policy,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {policyContent.map((policy) => {
        return (
          <>
            {policy.isShown && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
                key={policy.id}
              >
                <span style={{ fontWeight: 600 }}>{policy?.policy_name}:</span>
                {policy?.policy_content ? (
                  <div style={{ lineHeight: "1.75rem" }}>
                    {parse(policy?.policy_content)}
                  </div>
                ) : null}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};
export default Policies;
