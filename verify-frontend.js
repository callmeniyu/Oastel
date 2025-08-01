/**
 * Frontend Verification Script
 * 
 * Run this in your browser's console on the booking page to verify
 * that the frontend is using the correct minimumPerson values
 */

console.log('🧪 Frontend MinimumPerson Verification');

// Check if timeSlots are loaded
if (window.timeSlots || localStorage.getItem('timeSlots')) {
    console.log('✅ TimeSlots found in page');
    
    // Try to access React state (this might not work depending on React version)
    const slots = window.timeSlots || JSON.parse(localStorage.getItem('timeSlots') || '[]');
    
    slots.forEach(slot => {
        console.log(`📋 Slot ${slot.time}:`);
        console.log(`   bookedCount: ${slot.bookedCount}`);
        console.log(`   minimumPerson: ${slot.minimumPerson}`);
        console.log(`   currentMinimum: ${slot.currentMinimum}`);
        
        if (slot.minimumPerson !== slot.currentMinimum) {
            console.log(`⚠️  Warning: minimumPerson (${slot.minimumPerson}) != currentMinimum (${slot.currentMinimum})`);
        }
    });
} else {
    console.log('❌ No timeSlots data found. Make sure you\'re on the booking page with slots loaded.');
}

console.log('\n📝 Instructions:');
console.log('1. Select a time slot on the booking page');
console.log('2. Check the browser console for slot data logs');
console.log('3. Verify that minimumPerson values are correct:');
console.log('   - For unbooked slots: minimumPerson should be package minimum (e.g., 2)');
console.log('   - For booked slots: minimumPerson should be 1 (for non-private packages)');
console.log('4. Try booking 1 person on a slot that has bookings - it should be allowed');
console.log('5. Try booking 1 person on an empty slot - it should be denied (if package minimum > 1)');
