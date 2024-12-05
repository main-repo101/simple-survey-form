import React from 'react';

import { ISurveyRecordProps } from '@learn/web/frontend/simple_survey_form/model/ISurveyRecordProps';

const SurveyRecord: React.FC<ISurveyRecordProps> = ({ headers, records }) => {
  return (
    <div className="overflow-x-auto">
      <h2>Records</h2>
      <table className="min-w-full border-collapse border border-gray-300 text-left bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-gray-700 font-semibold border border-gray-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-gray-600 border border-gray-300"
                  >
                    {record[header] !== undefined ? record[header] : '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center px-4 py-4 text-gray-500"
              >
                No records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyRecord;