import React from 'react';
import StudentRankCard from './StudentRankCard';

const ClassRanking = ({ rankings }) => {
    if (!rankings || rankings.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No rankings available for this class.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rankings.map((ranking, index) => (
                <StudentRankCard
                    key={ranking._id}
                    ranking={ranking}
                    position={index + 1}
                />
            ))}
        </div>
    );
};

export default ClassRanking; 