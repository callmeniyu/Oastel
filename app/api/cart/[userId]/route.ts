import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, error: errorData.error || 'Failed to fetch cart' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(
            { success: true, data: data.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;
        const { searchParams } = new URL(request.url);
        const itemIndex = searchParams.get('itemIndex');
        
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`;
        if (itemIndex !== null) {
            url += `/${itemIndex}`;
        }
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, error: errorData.error || 'Failed to remove from cart' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        return NextResponse.json(
            { success: true, data: data.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to remove from cart' },
            { status: 500 }
        );
    }
}
