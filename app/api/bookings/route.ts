import { NextRequest, NextResponse } from 'next/server';

// Timeout wrapper for API calls
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        )
    ]);
};

export async function POST(request: NextRequest) {
    try {
        const bookingData = await request.json();
        
        // Call your backend API to create booking with timeout
        const response = await withTimeout(
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            }),
            8000 // 8 second timeout
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, error: errorData.error || 'Failed to create booking' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(
            { success: true, data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error && error.message === 'Request timeout' ? 'Request timed out' : 'Failed to create booking' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const packageType = searchParams.get('packageType');
        const status = searchParams.get('status');
        const date = searchParams.get('date');
        const userId = searchParams.get('userId');
        
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/bookings?`;
        if (packageType) url += `packageType=${packageType}&`;
        if (status) url += `status=${status}&`;
        if (date) url += `date=${date}&`;
        if (userId) url += `userId=${userId}&`;

        const response = await withTimeout(
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            8000 // 8 second timeout
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, error: errorData.error || 'Failed to fetch bookings' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const bookings = data.bookings || data.data || [];
        
        return NextResponse.json(
            { success: true, bookings },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error && error.message === 'Request timeout' ? 'Request timed out' : 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
