import Ticket from "../models/Ticket.js"

export const createTicket = async (req, res) => {
    try {
        const { title, description, orderId, mobileNumber } = req.body;

        // const images = req.files.map(file => file.path);

        const ticket = new Ticket({
            title,
            description,
            orderId,
            mobileNumber,
            // images
        });

        await ticket.save();
        res.status(201).json({ success: true, ticket });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export const getTickets = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        let query = {};
        if (search) {
            query = {
                $or: [
                    { orderId: { $regex: search, $options: 'i' } },
                    { mobileNumber: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Get total count for pagination
        const total = await Ticket.countDocuments(query);

        // Get paginated and filtered tickets
        const tickets = await Ticket.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


