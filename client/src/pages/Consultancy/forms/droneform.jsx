import React, { useMemo, useState } from "react";

const DroneForm = ({ selectedWork, onBack, onSubmit }) => {
  const initialFormData = useMemo(
    () => ({
      owiRefNo: "BITCPP",
      projectDurationFrom: "",
      projectDurationTo: "",
      quotationFile: null,
      totalAmountWithGST: "",
      totalAmountWithoutGST: "",
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
      equipment: [
        {
          item: "",
          calibrationDoneReadilyAvailable: false,
          requiresMaintenance: false,
        },
        {
          item: "",
          calibrationDoneReadilyAvailable: false,
          requiresMaintenance: false,
        },
      ],
      activities: Array.from({ length: 4 }, () => ({
        proposedActivity: "",
        description: "",
        availability: "",
        startDate: "",
        endDate: "",
        responsible: "",
      })),
    }),
    [],
  );

  const [formData, setFormData] = useState(initialFormData);

  // Helper function to get institute percentage from split code
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
      // Recalculate amounts when totalAmountWithoutGST changes
      if (name === "totalAmountWithoutGST" && prev.financialSplit) {
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, quotationFile: file }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const total = parseFloat(prev.totalAmountWithoutGST) || 0;
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
      const total = parseFloat(prev.totalAmountWithoutGST) || 0;
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

  const handleEquipmentChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleActivityChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
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

  const addEquipmentRow = () => {
    setFormData((prev) => ({
      ...prev,
      equipment: [
        ...prev.equipment,
        {
          item: "",
          calibrationDoneReadilyAvailable: false,
          requiresMaintenance: false,
        },
      ],
    }));
  };

  const addActivityRow = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        {
          proposedActivity: "",
          description: "",
          availability: "",
          startDate: "",
          endDate: "",
          responsible: "",
        },
      ],
    }));
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

  const removeEquipmentRow = (index) => {
    if (formData.equipment.length > 1) {
      setFormData((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((_, i) => i !== index),
      }));
    }
  };

  const removeActivityRow = (index) => {
    if (formData.activities.length > 1) {
      setFormData((prev) => ({
        ...prev,
        activities: prev.activities.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <div className="flex items-start justify-between gap-4">
              <div className="text-xl font-semibold">
                Annexure 3 (A): Principal Investigator Declaration on Plan of
                Action
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

            <div className="mt-4 space-y-2">
              <div>
                <span className="font-semibold">A.1</span> Project Duration
                (Planned): From
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400">
                  <input
                    name="projectDurationFrom"
                    value={formData.projectDurationFrom}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
                To
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400">
                  <input
                    name="projectDurationTo"
                    value={formData.projectDurationTo}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="whitespace-nowrap">
                  Total Consultancy Amount in Rs. (With GST):
                </span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithGST"
                    value={formData.totalAmountWithGST}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>

                <span className="whitespace-nowrap">(Without GST):</span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithoutGST"
                    value={formData.totalAmountWithoutGST}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">
                    Quotation Report (PDF):
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {formData.quotationFile && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-semibold whitespace-nowrap">
                  Recommended Financial Split:
                </span>
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

            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium">List of members involved:</div>
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
                              handleMemberChange(idx, "amount", e.target.value)
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

            <div className="mt-4">
              <div className="font-semibold">A.2</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="font-medium">
                  List of Equipment/Facility required and its accessibility
                  status:
                </div>
                <button
                  type="button"
                  onClick={addEquipmentRow}
                  className="border border-dashed border-gray-400 text-gray-700 rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
                >
                  Add Row
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {formData.equipment.map((row, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2 relative">
                    <button
                      type="button"
                      onClick={() => removeEquipmentRow(idx)}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs transition-colors"
                      title="Remove row"
                    >
                      -
                    </button>
                    <div className="w-6 font-medium">{idx + 1}.</div>
                    <div className="flex-1 min-w-[240px] border-b border-dotted border-gray-400">
                      <input
                        value={row.item}
                        onChange={(e) =>
                          handleEquipmentChange(idx, "item", e.target.value)
                        }
                        className="w-full bg-transparent outline-none px-1"
                      />
                    </div>

                    <label className="flex items-center gap-1 whitespace-nowrap ml-3">
                      <input
                        type="checkbox"
                        checked={row.calibrationDoneReadilyAvailable}
                        onChange={(e) =>
                          handleEquipmentChange(
                            idx,
                            "calibrationDoneReadilyAvailable",
                            e.target.checked,
                          )
                        }
                        className="h-3 w-3"
                      />
                      <span className="text-sm">
                        Calibration Done &amp; Readily Available
                      </span>
                    </label>

                    <label className="flex items-center gap-1 whitespace-nowrap ml-2">
                      <input
                        type="checkbox"
                        checked={row.requiresMaintenance}
                        onChange={(e) =>
                          handleEquipmentChange(
                            idx,
                            "requiresMaintenance",
                            e.target.checked,
                          )
                        }
                        className="h-3 w-3"
                      />
                      <span className="text-sm">Requires Maintenance</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-medium">Activity Plan:</div>
                <button
                  type="button"
                  onClick={addActivityRow}
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
                        Start Date
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        End Date
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Responsible Person(s)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.activities.map((row, idx) => (
                      <tr key={idx} className="relative">
                        <td className="border border-gray-300 p-3">
                          <button
                            type="button"
                            onClick={() => removeActivityRow(idx)}
                            className="absolute -left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs transition-colors"
                            title="Remove row"
                          >
                            -
                          </button>
                          <input
                            value={row.proposedActivity}
                            onChange={(e) =>
                              handleActivityChange(
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
                            value={row.description}
                            onChange={(e) =>
                              handleActivityChange(
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
                            value={row.availability}
                            onChange={(e) =>
                              handleActivityChange(
                                idx,
                                "availability",
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
                        <td className="border border-gray-300 p-3 w-[140px]">
                          <input
                            value={row.startDate}
                            onChange={(e) =>
                              handleActivityChange(
                                idx,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[140px]">
                          <input
                            value={row.endDate}
                            onChange={(e) =>
                              handleActivityChange(
                                idx,
                                "endDate",
                                e.target.value,
                              )
                            }
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={row.responsible}
                            onChange={(e) =>
                              handleActivityChange(
                                idx,
                                "responsible",
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

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DroneForm;
