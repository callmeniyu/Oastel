import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const packageId = searchParams.get('packageId');
        
        if (!packageId) {
            return NextResponse.json(
                { success: false, error: 'packageId parameter is required' },
                { status: 400 }
            );
        }

        // Call your backend API to check time slots
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/timeslot/debug?packageId=${packageId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch debug info' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(
            { success: true, data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in debug endpoint:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch debug info' },
            { status: 500 }
        );
    }
}
