const mongoose = require('mongoose');

const studentRankingSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kelas',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        default: 'Level 0'
    },
    rank: {
        type: Number,
        default: 0
    },
    quizScores: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        pointsEarned: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate level based on points
studentRankingSchema.methods.calculateLevel = function() {
    const points = this.points;
    if (points === 0) return 'Level 0';
    // Level up every 250 points, starting from Level 0
    const level = Math.floor(points / 250);
    return `Level ${level}`;
};

// Update rank and level before saving
studentRankingSchema.pre('save', async function(next) {
    console.log('Pre-save hook triggered for ranking entry:', this);
    try {
        // Calculate new level based on points
        const newLevel = this.calculateLevel();
        if (newLevel !== this.level) {
            const oldLevel = this.level;
            this.level = newLevel;
            // Update user's level in User model
            await mongoose.model('User').findByIdAndUpdate(this.student, {
                current_level: newLevel
            });
            // Add a flag to indicate level up for the post-save hook or route handler
            this._levelUpOccurred = true;
        }

        const rankings = await this.constructor.find({ class: this.class })
            .sort({ points: -1 });
        
        const rank = rankings.findIndex(r => r._id.toString() === this._id.toString()) + 1;
        console.log('Calculated rank:', rank, 'for student:', this.student, 'in class:', this.class);
        this.rank = rank;
        console.log('Ranking entry before saving:', this);
        next();
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        next(error);
    }
});

module.exports = mongoose.model('StudentRanking', studentRankingSchema); 