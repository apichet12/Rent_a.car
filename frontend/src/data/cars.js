// Shared car data used by Home and CarList
export const cars = Array.from({length: 24}, (_,i) => ({
  id: i+1,
  name: [
    'Toyota Camry','Honda Civic','BMW X1','Mazda 2','Ford Ranger','Toyota Commuter','Nissan Almera','Isuzu D-Max','Suzuki Swift','Chevrolet Captiva','Hyundai H1','Mitsubishi Pajero','MG ZS','Honda Accord','Toyota Fortuner','Mazda CX-5','Ford Everest','BMW 3 Series','Mercedes C-Class','Audi Q5','Volvo XC40','Honda Jazz','Toyota Yaris','Subaru XV'
  ][i%24],
  image: [
    'https://images.unsplash.com/photo-1511918984145-48de785d4c4e',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a',
    'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  ][i%6],
  price: 800 + (i%8)*200,
  desc: 'รถเช่าคุณภาพดี ราคาประหยัด',
  year: 2021 + (i%5),
  seats: [5,7,12,4,2][i%5],
  fuel: ['เบนซิน','ดีเซล','ไฟฟ้า'][i%3],
  features: ['แอร์','Bluetooth','Cruise Control','กล้องหลัง','USB','ABS','Eco Mode','Airbags','4WD','Sunroof','Navigation','Park Assist','TV','แอร์รอบคัน'].slice(0,4+(i%5)),
}));

export default cars;
