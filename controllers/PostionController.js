const PostionModel = require('../model/OpenPosition.model');
const PostionApply = require('../model/PostionApply.model')
const Sendmail = require('../utils/sendMail')
exports.createPosition = async (req, res) => {
    try {
        const { jobPosition, location, requirements, benefits, applicationProcess } = req.body;

        // Validate requirements structure
        // Validate requirements structure
        if (!Array.isArray(requirements.subjects) || requirements.subjects.length === 0 ||
            !Array.isArray(requirements.qualifications) || requirements.qualifications.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid structure in requirements.' });
        }


        const newPosition = new PostionModel({
            jobPosition,
            location,
            requirements,
            benefits,
            applicationProcess,
        });

        // Save the new position to the database
        const savedPosition = await newPosition.save();

        res.status(201).json({ success: true, position: savedPosition });
    } catch (error) {
        console.error('Error creating position:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.getPostion = async (req, res) => {
    try {
        // Fetch all positions from the database
        const positions = await PostionModel.find();

        res.status(200).json({ success: true, positions });
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.getSinglePostion = async (req, res) => {
    try {
        const { positionId } = req.params;

        // Fetch a single position by ID from the database
        const position = await PostionModel.findById(positionId);

        if (!position) {
            return res.status(404).json({ success: false, error: 'Position not found.' });
        }

        res.status(200).json({ success: true, position });
    } catch (error) {
        console.error('Error fetching position:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


exports.ApplyForJobPostion = async (req, res) => {
    try {
        const { name, email, contactNumber, resumeLink,occupation } = req.body;

        // Validate the presence of required fields
        if (!name || !email || !contactNumber || !resumeLink) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Create a new application
        const newApplication = new PostionApply({
            name,
            email,
            contactNumber,
            resumeLink,
        });

        // Save the application to the database
        const savedApplication = await newApplication.save();

        // Send an email (you may implement this based on your requirements)

        const options = {
            email,
            subject: 'Job Application Received',
            message: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Ekam Innocations</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
            
                .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 10px;
                  /* From https://css.glass */
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
                }
            
                h1 {
                  color: #007bff;
                }
            
                p {
                  color: #333;
                }
            
                .button-container {
                    text-align: center;
                    margin-top: 20px;
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .btn:hover {
                    background-color: #0056b3;
                }
                a{
                    color: #fff!important;
                }
                
                /* Additional styles for older versions of Internet Explorer */
                .btn {
                    /* For IE 11 */
                    display: -ms-inline-flexbox;
                    -ms-inline-flex-align: center;
                    -ms-inline-flex-pack: center;
                
                    /* For IE 10 */
                    display: -webkit-inline-box;
                    -webkit-box-align: center;
                    -webkit-box-pack: center;
                
                    /* For IE 9 */
                    display: inline-block;
                    *zoom: 1;
                    *display: inline;
                }
                .btn {
                    mso-line-height-rule: exactly;
                    display: inline-block;
                    text-align: center;
                    mso-hide: all;
                }
                
            
                .signature {
                  margin-top: 20px;
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <h1>Welcome to Ekam Innocations! 🌟</h1>
                <p>
                    Thank ${name} you for applying to join Ekam Innocations! We appreciate your interest and look forward to the possibility of having you on our team. 🚀
                </p>
            
                <p>
                  At Ekam Innocations, we believe in the power of innovating education and educating innovations to shape lives and nurture future leaders. 📚✨
                  We operate in three fundamental directions, each dedicated to fostering growth, innovation, and excellence in education. 🌐
                </p>
            
                <p>
                  When we contact you, expect a response within 24 hours. Your satisfaction is our priority! ⏰
                </p>
            
                <div class="button-container">
                  <a href="https://www.ekaminnocations.com" class="btn">Visit our Website 🌐</a>
                </div>
            
                <p class="signature">
                  Best regards,<br>
                  The Ekam Innocations Team 🌈
                </p>
              </div>
            </body>
            </html>
            `,

        }
        await Sendmail(options);

        res.status(201).json({ success: true, application: savedApplication });
    } catch (error) {
        console.error('Error applying for job position:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
