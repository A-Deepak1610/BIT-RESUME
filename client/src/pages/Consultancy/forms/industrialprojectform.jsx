import React, { useMemo, useState } from "react";

export default function IndustrialProjectForm({
  selectedWork,
  onBack,
  onSubmit,
  isSubmitting = false,
}) {
  const initialFormData = useMemo(
    () => ({
      owiRefNo: "BITCPP",
      trainingDurationFrom: "",
      trainingDurationTo: "",
      totalAmountWithGst: "",
      totalAmountWithoutGst: "",
      quotationFile: null,
      financialSplit: "",
      members: [
        {
          sNo: 1,
          name: "INSTITUTION",
          designation: "-",
          department: "-",
          financialSplit: "",
          amount: "",
        },
        {
          sNo: 2,
          name: "",
          designation: "",
          department: "",
          financialSplit: "",
          amount: "",
        },
        {
          sNo: 3,
          name: "",
          designation: "",
          department: "",
          financialSplit: "",
          amount: "",
        },
        {
          sNo: 4,
          name: "",
          designation: "",
          department: "",
          financialSplit: "",
          amount: "",
        },
      ],
      travelPlans: [
        {
          proposedActivity: "",
          requiredOnDutyDate: "",
          travelRequired: "",
          requestedTravelAllowance: "",
          requestedDearnessAllowance: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          requiredOnDutyDate: "",
          travelRequired: "",
          requestedTravelAllowance: "",
          requestedDearnessAllowance: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          requiredOnDutyDate: "",
          travelRequired: "",
          requestedTravelAllowance: "",
          requestedDearnessAllowance: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          requiredOnDutyDate: "",
          travelRequired: "",
          requestedTravelAllowance: "",
          requestedDearnessAllowance: "",
          responsiblePersons: "",
        },
      ],
      additionalResources: [
        {
          proposedActivity: "",
          description: "",
          availabilityOfConsumables: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          description: "",
          availabilityOfConsumables: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          description: "",
          availabilityOfConsumables: "",
          responsiblePersons: "",
        },
        {
          proposedActivity: "",
          description: "",
          availabilityOfConsumables: "",
          responsiblePersons: "",
        },
      ],
    }),
    [],
  );

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.trainingDurationFrom) e.trainingDurationFrom = "Required";
    if (!data.trainingDurationTo) e.trainingDurationTo = "Required";
    if (!data.totalAmountWithGst) e.totalAmountWithGst = "Required";
    if (!data.totalAmountWithoutGst) e.totalAmountWithoutGst = "Required";
    if (!data.financialSplit) e.financialSplit = "Please select a financial split";
    const hasNamedMember = data.members.slice(1).some((m) => m.name.trim());
    if (!hasNamedMember) e.members = "At least one member name is required";
    return e;
  };

  const getInstitutePercentage = (splitCode) => {
    const splitMap = {
      "40-60": 40,
      "30-70": 30,
      "80-20": 80,
      "0-100": 0,
      "ROI": 0,
    };
    return splitMap[splitCode] ?? null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      // Recalculate amounts when totalAmountWithoutGst changes
      if (name === "totalAmountWithoutGst" && prev.financialSplit) {
        const total = parseFloat(value) || 0;
        const institutePercent = getInstitutePercentage(prev.financialSplit);
        if (institutePercent !== null) {
          const instituteAmount = Math.round(total * institutePercent / 100);
          const remainingAmount = total - instituteAmount;
          newState.members = prev.members.map((member, i) => {
            if (i === 0) {
              return { ...member, financialSplit: `${institutePercent}%`, amount: instituteAmount.toString() };
            }
            // Recalculate other members' amounts based on their percentage of remaining amount
            const memberPercent = parseFloat(member.financialSplit) || 0;
            const memberAmount = Math.round(remainingAmount * memberPercent / 100);
            return { ...member, amount: memberPercent ? memberAmount.toString() : member.amount };
          });
        }
      }
      return newState;
    });
  };

  const handleQuotationFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({
      ...prev,
      quotationFile: file,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const total = parseFloat(prev.totalAmountWithoutGst) || 0;
      const institutePercent = getInstitutePercentage(prev.financialSplit);
      const instituteAmount = institutePercent !== null ? Math.round(total * institutePercent / 100) : 0;
      const remainingAmount = total - instituteAmount;
      return {
        ...prev,
        members: prev.members.map((member, i) => {
          if (i !== index) return member;
          const updatedMember = { ...member, [field]: value };
          // Auto-calculate amount when financialSplit is entered for non-first rows
          if (field === "financialSplit" && index > 0 && remainingAmount > 0) {
            const percent = parseFloat(value) || 0;
            const amount = Math.round(remainingAmount * percent / 100);
            updatedMember.amount = percent ? amount.toString() : "";
          }
          return updatedMember;
        }),
      };
    });
  };

  const handleFinancialSplitChange = (splitCode) => {
    setFormData((prev) => {
      const newSplit = prev.financialSplit === splitCode ? "" : splitCode;
      const total = parseFloat(prev.totalAmountWithoutGst) || 0;
      const institutePercent = getInstitutePercentage(newSplit);
      
      let updatedMembers = prev.members;
      if (newSplit === "ROI") {
        // Set all members with names to 0% and 0 amount for ROI
        updatedMembers = prev.members.map((member) => ({
          ...member,
          financialSplit: member.name ? "0%" : "",
          amount: member.name ? "0" : "",
        }));
      } else if (newSplit && institutePercent !== null) {
        const instituteAmount = Math.round(total * institutePercent / 100);
        const remainingAmount = total - instituteAmount;
        updatedMembers = prev.members.map((member, i) => {
          if (i === 0) {
            return { ...member, financialSplit: `${institutePercent}%`, amount: total ? instituteAmount.toString() : "" };
          }
          // Recalculate other members' amounts based on their percentage of remaining amount
          const memberPercent = parseFloat(member.financialSplit) || 0;
          const memberAmount = Math.round(remainingAmount * memberPercent / 100);
          return { ...member, amount: memberPercent && remainingAmount ? memberAmount.toString() : member.amount };
        });
      } else {
        // Clear first row's calculated values when deselecting
        updatedMembers = prev.members.map((member, i) => {
          if (i === 0) {
            return { ...member, financialSplit: "", amount: "" };
          }
          return member;
        });
      }
      
      return {
        ...prev,
        financialSplit: newSplit,
        members: updatedMembers,
      };
    });
  };

  const handleTravelPlanChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      travelPlans: prev.travelPlans.map((plan, i) =>
        i === index ? { ...plan, [field]: value } : plan,
      ),
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalResources: prev.additionalResources.map((resource, i) =>
        i === index ? { ...resource, [field]: value } : resource,
      ),
    }));
  };

  const addMemberRow = () => {
    setFormData((prev) => {
      const nextSNo = prev.members.length + 1;
      return {
        ...prev,
        members: [
          ...prev.members,
          {
            sNo: nextSNo,
            name: "",
            designation: "",
            department: "",
            financialSplit: "",
            amount: "",
          },
        ],
      };
    });
  };

  const removeMemberRow = (index) => {
    if (formData.members.length > 1) {
      setFormData((prev) => ({
        ...prev,
        members: prev.members
          .filter((_, i) => i !== index)
          .map((m, i) => ({ ...m, sNo: i + 1 })),
      }));
    }
  };

  const addTravelPlanRow = () => {
    setFormData((prev) => ({
      ...prev,
      travelPlans: [
        ...prev.travelPlans,
        {
          proposedActivity: "",
          requiredOnDutyDate: "",
          travelRequired: "",
          requestedTravelAllowance: "",
          requestedDearnessAllowance: "",
          responsiblePersons: "",
        },
      ],
    }));
  };

  const removeTravelPlanRow = (index) => {
    if (formData.travelPlans.length > 1) {
      setFormData((prev) => ({
        ...prev,
        travelPlans: prev.travelPlans.filter((_, i) => i !== index),
      }));
    }
  };

  const addResourceRow = () => {
    setFormData((prev) => ({
      ...prev,
      additionalResources: [
        ...prev.additionalResources,
        {
          proposedActivity: "",
          description: "",
          availabilityOfConsumables: "",
          responsiblePersons: "",
        },
      ],
    }));
  };

  const removeResourceRow = (index) => {
    if (formData.additionalResources.length > 1) {
      setFormData((prev) => ({
        ...prev,
        additionalResources: prev.additionalResources.filter(
          (_, i) => i !== index,
        ),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    onSubmit?.(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button & Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200 mr-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Consultancy Works</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Submit Declaration
        </h1>
        <p className="text-gray-600">
          Fill the declaration form for:{" "}
          <span className="font-semibold">{selectedWork?.projectTitle}</span>
        </p>
      </div>

      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-gray-800 text-base leading-relaxed">
            {/* Form Header with OWI Reference */}
            <div className="flex items-start justify-between gap-4">
              <div className="text-xl font-semibold">
                Annexure 2 (B): Faculty Declaration on Plan of Action
              </div>
              <div className="whitespace-nowrap text-sm font-medium">
                OWI REF NO:{" "}
                <span className="inline-block align-bottom min-w-[140px] border-b border-dotted border-gray-400">
                  <input
                    name="owiRefNo"
                    value={formData.owiRefNo}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
              </div>
            </div>

            {/* B.1 Training Programme Duration */}
            <div className="mt-4 space-y-2">
              <div>
                <span className="font-semibold">B.1</span> Training Programme
                Duration (Planned): From
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400" data-field="trainingDurationFrom">
                  <input
                    name="trainingDurationFrom"
                    value={formData.trainingDurationFrom}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                    placeholder="DD/MM/YYYY"
                  />
                </span>
                {errors.trainingDurationFrom && <span className="text-red-500 text-xs ml-1">{errors.trainingDurationFrom}</span>}
                To
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400" data-field="trainingDurationTo">
                  <input
                    name="trainingDurationTo"
                    value={formData.trainingDurationTo}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                    placeholder="DD/MM/YYYY"
                  />
                </span>
                {errors.trainingDurationTo && <span className="text-red-500 text-xs ml-1">{errors.trainingDurationTo}</span>}
                <span className="text-sm text-gray-600">
                  (To be filled after allotment, before project commencement)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="whitespace-nowrap">
                  Total Consultancy Amount in Rs. (With GST):
                </span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithGst"
                    value={formData.totalAmountWithGst}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>

                <span className="whitespace-nowrap">(Without GST):</span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithoutGst"
                    value={formData.totalAmountWithoutGst}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium whitespace-nowrap">
                  Industrial Training Cost Fixation Proposal (PDF):
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleQuotationFileChange}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                <span className="font-semibold whitespace-nowrap" data-field="financialSplit">
                  Recommended Financial Split:
                </span>
                {errors.financialSplit && <span className="text-red-500 text-xs">{errors.financialSplit}</span>}
                <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialSplit === "40-60"}
                    onChange={() => handleFinancialSplitChange("40-60")}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">40% Institute / 60% Faculty</span>
                </label>
                <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialSplit === "30-70"}
                    onChange={() => handleFinancialSplitChange("30-70")}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">30% Institute / 70% Faculty</span>
                </label>
                <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialSplit === "80-20"}
                    onChange={() => handleFinancialSplitChange("80-20")}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">80% Institute / 20% Faculty</span>
                </label>
                <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialSplit === "0-100"}
                    onChange={() => handleFinancialSplitChange("0-100")}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">100% Faculty</span>
                </label>
                <label className="flex items-center gap-1 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialSplit === "ROI"}
                    onChange={() => handleFinancialSplitChange("ROI")}
                    className="h-3 w-3"
                  />
                  <span className="text-sm">ROI</span>
                </label>
              </div>
            </div>

            {/* List of Members Involved */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium" data-field="members">
                  List of members involved:
                  {errors.members && <span className="text-red-500 text-xs ml-2">{errors.members}</span>}
                </div>
                <button
                  type="button"
                  onClick={addMemberRow}
                  className="border border-dashed border-gray-400 text-gray-700 rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
                >
                  Add Row
                </button>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="pl-5">
                  <table className="w-full border border-gray-300 border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          S.No.
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Name
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Designation
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Department
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Financial Split %
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Amount in Rupees
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.members.map((member, idx) => (
                        <tr key={member.sNo} className="relative">
                          <td className="border border-gray-300 p-3 w-[52px] font-medium">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => removeMemberRow(idx)}
                                className="absolute -left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs transition-colors"
                                title="Remove row"
                              >
                                -
                              </button>
                            )}
                            {member.sNo}.
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={member.name}
                              onChange={(e) =>
                                handleMemberChange(idx, "name", e.target.value)
                              }
                              className={`w-full bg-transparent outline-none ${idx === 0 ? "text-gray-500 cursor-not-allowed" : ""}`}
                              readOnly={idx === 0}
                            />
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={member.designation}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "designation",
                                  e.target.value,
                                )
                              }
                              className={`w-full bg-transparent outline-none ${idx === 0 ? "text-gray-500 cursor-not-allowed" : ""}`}
                              readOnly={idx === 0}
                            />
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={member.department}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "department",
                                  e.target.value,
                                )
                              }
                              className={`w-full bg-transparent outline-none ${idx === 0 ? "text-gray-500 cursor-not-allowed" : ""}`}
                              readOnly={idx === 0}
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[120px]">
                            <input
                              value={member.financialSplit}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "financialSplit",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[150px]">
                            <input
                              value={member.amount}
                              onChange={(e) =>
                                handleMemberChange(
                                  idx,
                                  "amount",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* B.2 On-duty and Travel Plan */}
            <div className="mt-6">
              <div className="font-semibold">B.2</div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium">On-duty and travel plan:</div>
                <button
                  type="button"
                  onClick={addTravelPlanRow}
                  className="border border-dashed border-gray-400 text-gray-700 rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
                >
                  Add Row
                </button>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="pl-5">
                  <table className="w-full border border-gray-300 border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Proposed Activity
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Required On-Duty Date
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Travel required (Yes/No)
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Requested Travel allowance (in Rs.)
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Requested Dearness allowance (in Rs.)
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Responsible Person(s)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.travelPlans.map((plan, idx) => (
                        <tr key={idx} className="relative">
                          <td className="border border-gray-300 p-3">
                            <button
                              type="button"
                              onClick={() => removeTravelPlanRow(idx)}
                              className="absolute -left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs transition-colors"
                              title="Remove row"
                            >
                              -
                            </button>
                            <input
                              value={plan.proposedActivity}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "proposedActivity",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[140px]">
                            <input
                              value={plan.requiredOnDutyDate}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "requiredOnDutyDate",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[120px]">
                            <select
                              value={plan.travelRequired}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "travelRequired",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-3 w-[150px]">
                            <input
                              value={plan.requestedTravelAllowance}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "requestedTravelAllowance",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[150px]">
                            <input
                              value={plan.requestedDearnessAllowance}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "requestedDearnessAllowance",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={plan.responsiblePersons}
                              onChange={(e) =>
                                handleTravelPlanChange(
                                  idx,
                                  "responsiblePersons",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* B.3 Additional Resources Required */}
            <div className="mt-6">
              <div className="font-semibold">B.3</div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium">
                  Additional Resources Required (If any):
                </div>
                <button
                  type="button"
                  onClick={addResourceRow}
                  className="border border-dashed border-gray-400 text-gray-700 rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
                >
                  Add Row
                </button>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="pl-5">
                  <table className="w-full border border-gray-300 border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Proposed Activity
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Description and consumable items/resources required
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Availability of consumables (Yes/No)
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          Responsible Person(s)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.additionalResources.map((resource, idx) => (
                        <tr key={idx} className="relative">
                          <td className="border border-gray-300 p-3">
                            <button
                              type="button"
                              onClick={() => removeResourceRow(idx)}
                              className="absolute -left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs transition-colors"
                              title="Remove row"
                            >
                              -
                            </button>
                            <input
                              value={resource.proposedActivity}
                              onChange={(e) =>
                                handleResourceChange(
                                  idx,
                                  "proposedActivity",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={resource.description}
                              onChange={(e) =>
                                handleResourceChange(
                                  idx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-3 w-[160px]">
                            <select
                              value={resource.availabilityOfConsumables}
                              onChange={(e) =>
                                handleResourceChange(
                                  idx,
                                  "availabilityOfConsumables",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-3">
                            <input
                              value={resource.responsiblePersons}
                              onChange={(e) =>
                                handleResourceChange(
                                  idx,
                                  "responsiblePersons",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded text-white font-medium transition-all ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Page Footer */}
      {/* <div className="text-center text-gray-500 text-sm mt-4">Page 1 of 1</div> */}
    </div>
  );
}
