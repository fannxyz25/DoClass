import React from 'react';

const StudentRankCard = ({ ranking, position }) => {
    const getMedalEmoji = (position) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return null;
        }
    };

    const medalEmoji = getMedalEmoji(position);

    return (
        <div className={`flex items-center p-4 rounded-lg ${
            position <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gray-50'
        }`}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mr-4">
                {medalEmoji ? (
                    <span className="text-2xl">{medalEmoji}</span>
                ) : (
                    <span className="text-lg font-semibold">{position}</span>
                )}
            </div>
            
            <div className="flex-grow">
                <h3 className="font-semibold text-lg">
                    {ranking.student?.name || 'Unknown Student'}
                </h3>
                <p className="text-sm text-gray-600">
                    {ranking.student?.email || 'No email'}
                </p>
            </div>
            
            <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                    {ranking.points} pts
                </div>
                <div className="text-sm text-gray-500">
                    Rank #{ranking.rank}
                </div>
            </div>
        </div>
    );
};

export default StudentRankCard; 