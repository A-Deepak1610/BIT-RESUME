import React, { useMemo, useState } from "react";

export default function ProjectDeclarationForm({ selectedWork, onBack, onSubmit }) {
  const initialDeclarationData = useMemo(
    () => ({
      owiRefNo: "BITCPP",
      projectDurationFrom: "",
      projectDurationTo: "",
      totalAmountWithGst: "",
      totalAmountWithoutGst: "",
      quotationReportFile: null,
      members: [
        { sNo: 1, name: "", designation: "", department: "", financialSplit: "", amount: "" },
        { sNo: 2, name: "", designation: "", department: "", financialSplit: "", amount: "" },
        { sNo: 3, name: "", designation: "", department: "", financialSplit: "", amount: "" },
        { sNo: 4, name: "", designation: "", department: "", financialSplit: "", amount: "" }
      ],
      equipment: [
        { item: "", calibrationDoneReadilyAvailable: false, requiresMaintenance: false },
        { item: "", calibrationDoneReadilyAvailable: false, requiresMaintenance: false }
      ],
      activities: Array.from({ length: 5 }, () => ({
        proposedActivity: "",
        description: "",
        availability: "",
        startDate: "",
        endDate: "",
        responsible: ""
      }))
    }),
    []
  );

  const [declarationData, setDeclarationData] = useState(initialDeclarationData);

  const handleDeclarationInputChange = (e) => {
    const { name, value } = e.target;
    setDeclarationData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setDeclarationData((prev) => ({
      ...prev,
      members: prev.members.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    }));
  };

  const handleEquipmentChange = (index, field, value) => {
    setDeclarationData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    }));
  };

  const handleActivityChange = (index, field, value) => {
    setDeclarationData((prev) => ({
      ...prev,
      activities: prev.activities.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    }));
  };

  const handleQuotationFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setDeclarationData((prev) => ({
      ...prev,
      quotationReportFile: file
    }));
  };

  const addMemberRow = () => {
    setDeclarationData((prev) => {
      const nextSNo = prev.members.length + 1;
      return {
        ...prev,
        members: [
          ...prev.members,
          { sNo: nextSNo, name: "", designation: "", department: "", financialSplit: "", amount: "" }
        ]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(declarationData);
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
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Consultancy Works</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Submit Declaration</h1>
        <p className="text-gray-600">
          Fill the declaration form for: <span className="font-semibold">{selectedWork?.projectTitle}</span>
        </p>
      </div>

      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-gray-800 text-base leading-relaxed">
            <div className="flex items-start justify-between gap-4">
              <div className="text-xl font-semibold">
                Annexure 1 (B): Principal Investigator Declaration on Plan of Action
              </div>
              <div className="whitespace-nowrap text-sm font-medium">
                OWI REF NO:{" "}
                <span className="inline-block align-bottom min-w-[140px] border-b border-dotted border-gray-400">
                  <input
                    name="owiRefNo"
                    value={declarationData.owiRefNo}
                    onChange={handleDeclarationInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div>
                <span className="font-semibold">B.1</span> Project Duration (Planned): From
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400">
                  <input
                    name="projectDurationFrom"
                    value={declarationData.projectDurationFrom}
                    onChange={handleDeclarationInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
                To
                <span className="inline-block align-bottom mx-1 min-w-[160px] border-b border-dotted border-gray-400">
                  <input
                    name="projectDurationTo"
                    value={declarationData.projectDurationTo}
                    onChange={handleDeclarationInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>
                <span className="text-sm text-gray-600">
                  (To be filled after allotment, before project commencement)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="whitespace-nowrap">Total Consultancy Amount in Rs. (With GST):</span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithGst"
                    value={declarationData.totalAmountWithGst}
                    onChange={handleDeclarationInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>

                <span className="whitespace-nowrap">(Without GST):</span>
                <span className="inline-block align-bottom mx-1 min-w-[180px] border-b border-dotted border-gray-400">
                  <input
                    name="totalAmountWithoutGst"
                    value={declarationData.totalAmountWithoutGst}
                    onChange={handleDeclarationInputChange}
                    className="w-full bg-transparent outline-none px-1"
                  />
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">Quotation Report (PDF):</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleQuotationFileChange}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                  />
                </div>
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
                <table className="w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-3 text-left font-semibold">S.No.</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Name</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Designation</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Department</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Financial Split %</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Amount in Rupees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declarationData.members.map((member, idx) => (
                      <tr key={member.sNo}>
                        <td className="border border-gray-300 p-3 w-[52px] font-medium">{member.sNo}.</td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={member.designation}
                            onChange={(e) => handleMemberChange(idx, "designation", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={member.department}
                            onChange={(e) => handleMemberChange(idx, "department", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[120px]">
                          <input
                            value={member.financialSplit}
                            onChange={(e) => handleMemberChange(idx, "financialSplit", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[150px]">
                          <input
                            value={member.amount}
                            onChange={(e) => handleMemberChange(idx, "amount", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4">
              <div className="font-semibold">B.2</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="font-medium">List of Equipment/Facility required and its accessibility status:</div>
              </div>

              <div className="mt-2 space-y-2">
                {declarationData.equipment.map((row, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2">
                    <div className="w-6 font-medium">{idx + 1}.</div>
                    <div className="flex-1 min-w-[240px] border-b border-dotted border-gray-400">
                      <input
                        value={row.item}
                        onChange={(e) => handleEquipmentChange(idx, "item", e.target.value)}
                        className="w-full bg-transparent outline-none px-1"
                      />
                    </div>

                    <label className="flex items-center gap-1 whitespace-nowrap ml-3">
                      <input
                        type="checkbox"
                        checked={row.calibrationDoneReadilyAvailable}
                        onChange={(e) =>
                          handleEquipmentChange(idx, "calibrationDoneReadilyAvailable", e.target.checked)
                        }
                        className="h-3 w-3"
                      />
                      <span className="text-sm">Calibration Done &amp; Readily Available</span>
                    </label>

                    <label className="flex items-center gap-1 whitespace-nowrap ml-2">
                      <input
                        type="checkbox"
                        checked={row.requiresMaintenance}
                        onChange={(e) => handleEquipmentChange(idx, "requiresMaintenance", e.target.checked)}
                        className="h-3 w-3"
                      />
                      <span className="text-sm">Requires Maintenance</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Proposed Activity</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Description and consumable items/resources required
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        Availability of consumables (Yes/No)
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Start Date</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">End Date</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Responsible Person(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declarationData.activities.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={row.proposedActivity}
                            onChange={(e) => handleActivityChange(idx, "proposedActivity", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={row.description}
                            onChange={(e) => handleActivityChange(idx, "description", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[160px]">
                          <input
                            value={row.availability}
                            onChange={(e) => handleActivityChange(idx, "availability", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[140px]">
                          <input
                            value={row.startDate}
                            onChange={(e) => handleActivityChange(idx, "startDate", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3 w-[140px]">
                          <input
                            value={row.endDate}
                            onChange={(e) => handleActivityChange(idx, "endDate", e.target.value)}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            value={row.responsible}
                            onChange={(e) => handleActivityChange(idx, "responsible", e.target.value)}
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

          <div className="flex justify-center pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
