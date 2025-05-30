const express = require('express');
const router = express.Router();
const StudentRanking = require('../models/StudentRanking');
const auth = require('./auth');

// Get rankings for a specific class
router.get('/class/:classId', auth, async (req, res) => {
    try {
        const rankings = await StudentRanking.find({ class: req.params.classId })
            .populate('student', 'name email')
            .sort({ points: -1 });
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update points after quiz completion
router.post('/update-points', auth, async (req, res) => {
    try {
        const { studentId, classId, quizId, score } = req.body;
        console.log('Received data for ranking update:', { studentId, classId, quizId, score });
        
        // Use actual score as points
        const pointsEarned = score;
        console.log('Points earned:', pointsEarned);
        
        let ranking = await StudentRanking.findOne({
            student: studentId,
            class: classId
        });

        const oldLevel = ranking ? ranking.level : 'Level 0';
        let levelUpMessage = null;

        if (!ranking) {
            console.log('Creating new ranking entry for student:', studentId, 'in class:', classId);
            ranking = new StudentRanking({
                student: studentId,
                class: classId,
                points: pointsEarned
            });
        } else {
            console.log('Updating existing ranking for student:', studentId, 'Current points:', ranking.points, 'Points earned:', pointsEarned);
            ranking.points += pointsEarned;
        }

        ranking.quizScores.push({
            quiz: quizId,
            score: score,
            pointsEarned: pointsEarned
        });

        console.log('Saving ranking entry:', ranking);
        await ranking.save();
        console.log('Ranking entry saved successfully.');

        // Check if level up occurred
        if (ranking.level !== oldLevel) {
            levelUpMessage = `Selamat! Anda telah naik ke level ${ranking.level}!`;
        }

        res.json({
            ranking,
            levelUpMessage
        });
    } catch (error) {
        console.error('Error in /update-points:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get student's ranking details
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const rankings = await StudentRanking.find({ student: req.params.studentId })
            .populate('class', 'name')
            .populate('quizScores.quiz', 'title')
            .sort({ points: -1 });
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get top students across all classes
router.get('/top-students', auth, async (req, res) => {
    try {
        const rankings = await StudentRanking.find()
            .populate('student', 'name email')
            .populate('class', 'name')
            .sort({ points: -1 })
            .limit(10);
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 