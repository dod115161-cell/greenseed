import {EXTRAS} from './storeExtras'
export const vnd=n=>Number(n).toLocaleString('vi-VN')+'đ'
export const STATUSES=['Chờ xác nhận','Đã xác nhận','Đang đóng gói','Đang giao','Hoàn thành']
const P=[
['Cà chua bi','Rau củ','Dễ','Xuân',70,25000,120,90,'6.0-6.8','20-30°C','Nắng đầy đủ','🍅'],
['Húng quế','Rau củ','Dễ','Hè',45,15000,8,85,'6.0-7.0','20-32°C','Nắng nhiều','🌿'],
['Cải xanh','Rau củ','Dễ','Thu',30,12000,200,92,'6.0-7.0','15-25°C','Nắng nhẹ','🥬'],
['Dưa leo','Rau củ','Trung bình','Hè',55,18000,60,88,'6.0-7.0','22-30°C','Nắng đầy đủ','🥒'],
['Ớt chỉ thiên','Rau củ','Trung bình','Xuân',90,20000,5,80,'6.0-6.8','22-32°C','Nắng đầy đủ','🌶️'],
['Hoa hướng dương','Hoa','Dễ','Hè',80,22000,75,90,'6.0-7.5','18-30°C','Nắng đầy đủ','🌻'],
['Đu đủ lùn','Cây ăn trái','Khó','Quanh năm',240,45000,40,75,'6.0-6.5','25-32°C','Nắng đầy đủ','🍈'],
['Xà lách hữu cơ','Hạt giống hữu cơ','Dễ','Đông',35,30000,90,95,'6.0-7.0','12-22°C','Bóng râm nhẹ','🥗']]
export const PRODUCTS=P.map((a,i)=>({id:i+1,name:a[0],cat:a[1],diff:a[2],season:a[3],days:a[4],price:a[5],stock:a[6],germ:a[7],ph:a[8],temp:a[9],light:a[10],emoji:a[11]}))
export const POSTS=[
{id:1,title:'Cách làm đất hữu cơ cho vườn ban công',body:'Trộn đất, xơ dừa và phân trùn quế theo tỉ lệ 3:1:1. Đảm bảo thoát nước tốt trước khi gieo.'},
{id:2,title:'Ủ hạt giống đúng cách để nảy mầm đều',body:'Ngâm hạt trong nước ấm 30-35°C từ 4-8 giờ, sau đó ủ khăn ẩm nơi thoáng mát đến khi nhú rễ.'},
{id:3,title:'Xử lý sâu bệnh bằng chế phẩm tự nhiên',body:'Dùng dung dịch tỏi ớt gừng phun buổi chiều mát, 5-7 ngày một lần để hạn chế sâu ăn lá.'}]
export const COMPANION={
'Cà chua bi':{good:[['Húng quế','Xua đuổi sâu bệnh, tăng hương vị cà chua']],bad:[['Dưa leo','Cạnh tranh dinh dưỡng, dễ lây bệnh nấm']]},
'Húng quế':{good:[['Cà chua bi','Cùng nhu cầu nắng, húng quế bảo vệ cà chua'],['Ớt chỉ thiên','Hợp điều kiện nắng và tưới nước']],bad:[]},
'Cải xanh':{good:[['Xà lách hữu cơ','Cùng ưa mát, tận dụng không gian'],['Hoa hướng dương','Thu hút ong bướm, che bóng nhẹ']],bad:[['Cà chua bi','Cạnh tranh dinh dưỡng']]},
'Dưa leo':{good:[['Hoa hướng dương','Làm giàn leo tự nhiên'],['Xà lách hữu cơ','Tận dụng bóng của giàn dưa']],bad:[['Cà chua bi','Dễ lây bệnh chung'],['Húng quế','Húng quế ảnh hưởng vị dưa']]},
'Ớt chỉ thiên':{good:[['Húng quế','Giảm rệp và bọ trĩ'],['Cà chua bi','Cùng chế độ chăm sóc']],bad:[['Đu đủ lùn','Tranh chấp dinh dưỡng đất']]},
'Hoa hướng dương':{good:[['Dưa leo','Dưa leo leo lên thân hoa']],bad:[['Cải xanh','Hoa hướng dương tiết chất ức chế mầm']]},
'Xà lách hữu cơ':{good:[['Cải xanh','Cùng ưa mát'],['Dưa leo','Nhận bóng râm từ giàn']],bad:[]},
'Đu đủ lùn':{good:[['Húng quế','Xua côn trùng gốc cây']],bad:[['Ớt chỉ thiên','Tranh chấp dinh dưỡng']]}}
export const USERS=[
{id:1,name:'Nguyễn Văn An',email:'an@mail.vn',role:'Customer',active:true},
{id:2,name:'Trần Thị Bình',email:'binh@mail.vn',role:'Seller',active:true},
{id:3,name:'Lê Quản Trị',email:'admin@mail.vn',role:'Admin',active:true},
{id:4,name:'Phạm Văn Cường',email:'cuong@mail.vn',role:'Customer',active:false}]
export const SETTINGS={name:'GreenSeed - Mầm Xanh',logo:'',hotline:'0900 123 456',address:'12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}

/* ===== GIAI ĐOẠN 2 ===== */

PRODUCTS.push(...[['Dưa hấu siêu ngọt','Cây ăn trái','Trung bình','Hè',85,45000,60,98,'6.0-6.8','25-35°C','Nắng đầy đủ','🍉'],
['Dâu tây New Zealand','Cây ăn trái','Khó','Xuân',90,52000,30,80,'5.5-6.5','15-26°C','Nắng nhẹ','🍓'],
['Cẩm tú cầu Nhật','Hoa','Trung bình','Xuân',120,48000,25,70,'5.0-6.5','15-25°C','Bán râm','💐'],
['Cà rốt baby Mỹ','Rau củ','Dễ','Thu',60,30000,80,88,'6.0-6.8','16-24°C','Nắng đầy đủ','🥕'],
['Sen đá đa sắc mix','Hoa','Dễ','Quanh năm',120,38000,45,75,'6.0-7.0','20-30°C','Nắng nhẹ','🪴']]
.map((a,i)=>({id:9+i,name:a[0],cat:a[1],diff:a[2],season:a[3],days:a[4],price:a[5],stock:a[6],germ:a[7],ph:a[8],temp:a[9],light:a[10],emoji:a[11]})))
COMPANION['Dưa hấu siêu ngọt']={good:[['Hoa hướng dương','Thu hút ong bướm giúp thụ phấn']],bad:[['Dưa leo','Cùng họ bầu bí, dễ lây bệnh chung']]}
COMPANION['Cà rốt baby Mỹ']={good:[['Xà lách hữu cơ','Xà lách che mát đất, tận dụng không gian giữa các luống']],bad:[]}
COMPANION['Dâu tây New Zealand']={good:[['Xà lách hữu cơ','Giữ ẩm đất và hạn chế cỏ dại']],bad:[['Cải xanh','Cạnh tranh dinh dưỡng và dễ chung sâu hại']]}
PRODUCTS.forEach(p=>Object.assign(p,EXTRAS[p.name]||{}))
export const BLOG_CATS=['Drama & Sửa sai','Nhật ký & Thách thức','Bóc phốt & Sự thật','Phong cách sống & Chill','Bài toán Kinh tế','Mẹo Dân gian & Rác bếp']
PRODUCTS.push(...[['Phân hữu cơ vi sinh',48000,'🧴'],['Dầu Neem sinh học',70000,'🧪'],['Khay ươm hạt',35000,'🧫'],['Chậu treo ban công',60000,'🪴'],['Đất trồng hữu cơ (5kg)',55000,'🟤'],['Giàn leo mini',90000,'🪜']]
.map(([name,price,emoji],i)=>({id:101+i,name,cat:'Vật tư & dụng cụ',diff:'Dễ',season:'Quanh năm',days:0,price,stock:50,germ:'-',ph:'-',temp:'-',light:'-',emoji})))
/* ===== Combo & Wiki: vật tư bổ sung (id 107-110) ===== */
PRODUCTS.push(...[['Đất sạch Tribat',45000,'🟫'],['Chậu nhựa 30cm',35000,'🪣'],['Chế phẩm Trichoderma',65000,'🧬'],['Bẫy dính côn trùng vàng',30000,'🟨']]
.map(([name,price,emoji],i)=>({id:107+i,name,cat:'Vật tư & dụng cụ',diff:'Dễ',season:'Quanh năm',days:0,price,stock:50,germ:'-',ph:'-',temp:'-',light:'-',emoji})))
COMPANION['Cà chua bi'].bad.push(['Khoai tây','Dễ lây chéo bệnh sương mai'])
const LEAF=['Cải xanh','Xà lách hữu cơ','Húng quế']
export const CROPS=Object.fromEntries(PRODUCTS.filter(p=>p.days>0).map(p=>{const leaf=LEAF.includes(p.name),h=p.days
const f=[[10,'Phân hữu cơ vi sinh / NPK pha loãng'],[18,'Phân hữu cơ vi sinh / NPK pha loãng']]
if(h>25)f.push([Math.min(24,h-8),leaf?'Đạm hữu cơ (nước ủ đậu, phân cá)':'Kali/Cansibo hỗ trợ đậu quả'])
if(h>=45)f.push([32,leaf?'Đạm hữu cơ đợt 3':'Kali/Cansibo đợt 3'])
return [p.name,{germinationDays:p.name==='Đu đủ lùn'?14:7,harvestDays:h,wateringFrequency:'Giai đoạn đầu phun sương 2 lần/ngày, sau đó tưới gốc 1 lần/ngày',fertilizingSchedule:f.filter(x=>x[0]<h),leaf,
harvestTip:leaf?'Thu hoạch buổi sáng sớm khi lá giòn, chưa ra hoa; nhổ cả gốc hoặc cắt sát gốc.':'Thu khi quả/hoa đạt màu chín đặc trưng, hái buổi sáng mát để giữ độ ngon.',
rotation:leaf?'Luân canh sang cây họ Đậu (đậu cove, đậu tương) để trả lại đạm cho đất sau vụ rau ăn lá tốn đạm.':'Luân canh sang rau ăn lá hoặc cây họ Đậu; bổ sung phân chuồng hoai và vôi nhẹ để phục hồi đất sau vụ tốn Kali.'}]}))
PRODUCTS.forEach(p=>{if(CROPS[p.name])Object.assign(p,CROPS[p.name],{companionPlants:COMPANION[p.name]?.good.map(x=>x[0])||[],avoidPlants:COMPANION[p.name]?.bad.map(x=>x[0])||[]})})
const PC=['Mẹo làm đất','Kỹ thuật gieo hạt','Trị bệnh cây'],PR=[[105,101],[103,1],[102,2]]
POSTS.forEach((b,i)=>Object.assign(b,{cat:PC[i],cover:['🟤','💧','🐛'][i],related:PR[i]}))
POSTS.push({id:4,title:'Biến ban công 3m² thành vườn rau xanh',cat:'Thiết kế sân vườn',cover:'🏡',body:'Dùng giàn leo phía sau, khay rau tầng ở giữa và chậu treo phía trước để tận dụng tối đa ánh sáng.',related:[104,106,3]},
{id:5,title:'Review cà chua bi: nảy mầm đều, dễ trồng',cat:'Review hạt giống',cover:'🍅',body:'Tỉ lệ nảy mầm khoảng 90%, cây khỏe, cho quả sau khoảng 70 ngày. Hợp người mới bắt đầu.',related:[1]},
{id:6,title:'Nhận biết bệnh sương mai và cách xử lý hữu cơ',cat:'Trị bệnh cây',cover:'🍂',body:'Vết úa nâu loang trên lá sau đêm ẩm là dấu hiệu điển hình. Cắt lá bệnh, giảm ẩm và phun chế phẩm sinh học.',related:[102,3]})
export const DISEASES=[
{vi:'Bệnh đốm lá',sci:'Cercospora spp.',cat:'Nấm',conf:[86,94],symptoms:'Đốm tròn nâu viền vàng trên lá già, lan dần lên lá non; lá khô và rụng.',cause:'Độ ẩm cao, tưới lên lá, trồng quá dày, tàn dư bệnh trong đất.',organic:'Ngắt bỏ lá bệnh, phun dịch tỏi-ớt-gừng vào chiều mát, tưới gốc buổi sáng.',chem:'Phun chế phẩm Trichoderma hoặc thuốc gốc đồng theo nhãn khi bệnh lan trên 30% số lá.',rx:[['Dầu Neem sinh học','Phun ngày 3 và ngày 7'],['Phân hữu cơ vi sinh','Bón ngày 14']],sch:[[1,'Cắt bỏ lá bệnh, đưa ra khỏi vườn'],[3,'Phun lần 1 (dầu Neem hoặc dịch tỏi ớt)'],[7,'Phun lần 2, kiểm tra vết đốm mới'],[14,'Bón phân hữu cơ vi sinh để phục hồi']]},
{vi:'Bệnh sương mai',sci:'Phytophthora infestans',cat:'Nấm',conf:[84,92],symptoms:'Vết úa nâu loang nhanh trên lá, mặt dưới có lớp mốc trắng sau đêm ẩm.',cause:'Đêm ẩm, ngày mát, lây chéo giữa cà chua và khoai tây.',organic:'Cắt lá bệnh, tăng thông thoáng, phun chế phẩm sinh học vào chiều mát.',chem:'Dùng thuốc đặc trị nấm noãn theo hướng dẫn của cửa hàng vật tư khi bệnh nặng.',rx:[['Dầu Neem sinh học','Phun ngày 1, 3, 7'],['Cải xanh','Trồng xen vụ sau để đa dạng hóa']],sch:[[1,'Cắt bỏ lá nhiễm, vệ sinh dụng cụ'],[3,'Phun chế phẩm sinh học lần 1'],[7,'Phun lần 2, giảm tưới ban đêm'],[14,'Đánh giá lại, bón Kali tăng sức đề kháng']]},
{vi:'Rệp xáp',sci:'Aphis spp.',cat:'Côn trùng',conf:[88,95],symptoms:'Rệp nhỏ bám ngọn và mặt dưới lá non, lá cuốn, có mật ngọt và kiến bu.',cause:'Thời tiết khô nóng, thừa đạm, thiếu thiên địch.',organic:'Xịt nước mạnh rửa rệp, phun nước xà phòng loãng hoặc dầu Neem, trồng húng quế quanh vườn.',chem:'Phun thuốc sinh học gốc Abamectin khi mật độ rệp cao, tuân thủ thời gian cách ly.',rx:[['Dầu Neem sinh học','Phun ngày 1 và 7'],['Húng quế','Trồng xen quanh luống']],sch:[[1,'Xịt nước rửa rệp, ngắt ngọn bị hại'],[3,'Phun dầu Neem lần 1'],[7,'Phun lần 2, kiểm tra kiến'],[14,'Bón phân cân đối, không bón thừa đạm']]},
{vi:'Thiếu vi chất (Mg, Fe)',sci:'Magnesium/Iron deficiency',cat:'Thiếu hụt dinh dưỡng',conf:[78,87],symptoms:'Lá vàng giữa các gân, gân vẫn xanh; lá già vàng trước (thiếu Mg) hoặc lá non vàng (thiếu Fe).',cause:'Đất nghèo dinh dưỡng, pH lệch khỏi 6.0-7.0, đất nén chặt.',organic:'Bón phân chuồng hoai, phủ gốc, rắc vỏ trứng nghiền, kiểm tra pH đất.',chem:'Bổ sung phân vi lượng chelate Mg/Fe phun lá theo nhãn.',rx:[['Phân hữu cơ vi sinh','Bón ngày 1 và 14'],['Đất trồng hữu cơ (5kg)','Thay lớp đất mặt ngày 7']],sch:[[1,'Kiểm tra pH, xới tơi đất'],[3,'Bón phân hữu cơ vi sinh'],[7,'Thay lớp đất mặt, rắc vỏ trứng'],[14,'Đánh giá màu lá mới']]}]
export const REGIONS=[
{n:'Hà Nội',lat:21.03,lng:105.85,climate:'Miền Bắc',rain:1700,ph:'6.0-6.8',terrain:'Đồng bằng, cao 10-20m',soil:'Phù sa sông Hồng',t:[17,33],h:'78%',A:['Tơi xốp trung bình','Humus khoảng 2.5%'],B:['Thịt pha sét, thoát nước vừa','Giữ khoáng tốt'],C:['Mẫu chất phù sa, pH 6.5','Nguy cơ úng mùa mưa']},
{n:'Sa Pa',lat:22.34,lng:103.84,climate:'Miền Bắc (núi cao)',rain:2800,ph:'5.0-6.0',terrain:'Núi cao 1.500m',soil:'Thịt nhẹ vùng núi',t:[10,22],h:'85%',A:['Rất tơi, nhiều mùn','Humus khoảng 4%'],B:['Thịt pha đá, thoát nước nhanh','Dễ rửa trôi khoáng'],C:['Đá mẹ phong hóa, pH 5.5','Nguy cơ chua, xói mòn']},
{n:'Đà Nẵng',lat:16.05,lng:108.2,climate:'Miền Trung',rain:2100,ph:'6.0-7.0',terrain:'Ven biển',soil:'Cát pha',t:[21,33],h:'77%',A:['Tơi xốp, ít mùn','Humus khoảng 1.2%'],B:['Cát pha, thoát nước rất nhanh','Giữ khoáng kém'],C:['Cát biển, pH 6.8','Nguy cơ nhiễm mặn']},
{n:'Đà Lạt',lat:11.94,lng:108.44,climate:'Tây Nguyên (cao nguyên)',rain:1750,ph:'5.5-6.5',terrain:'Cao nguyên 1.500m',soil:'Đỏ bazan pha mùn',t:[14,25],h:'80%',A:['Rất tơi xốp','Humus khoảng 5%'],B:['Sét đỏ, thoát nước tốt','Giữ khoáng cao'],C:['Bazan phong hóa, pH 5.8','Nguy cơ chua nhẹ']},
{n:'Buôn Ma Thuột',lat:12.67,lng:108.04,climate:'Tây Nguyên',rain:1850,ph:'5.5-6.5',terrain:'Cao nguyên 500m',soil:'Đỏ bazan',t:[20,30],h:'75%',A:['Tơi xốp tốt','Humus khoảng 3.5%'],B:['Sét pha, giữ nước khá','Giữ khoáng cao'],C:['Bazan, pH 5.6','Nguy cơ chua, cần vôi']},
{n:'TP. Hồ Chí Minh',lat:10.78,lng:106.7,climate:'Miền Nam',rain:1950,ph:'5.0-6.0',terrain:'Đồng bằng thấp',soil:'Xám, phù sa cổ',t:[25,34],h:'75%',A:['Khá chặt, ít mùn','Humus khoảng 1.8%'],B:['Thịt pha cát, thoát nước vừa','Giữ khoáng trung bình'],C:['Phù sa cổ, pH 5.2','Nguy cơ nhiễm chua']},
{n:'Cần Thơ',lat:10.03,lng:105.78,climate:'Miền Nam (ĐBSCL)',rain:1600,ph:'5.5-6.5',terrain:'Đồng bằng sông Cửu Long',soil:'Phù sa',t:[24,33],h:'80%',A:['Mịn, giàu mùn','Humus khoảng 3%'],B:['Sét, giữ nước rất tốt','Giữ khoáng cao'],C:['Phù sa mới, pH 6.0','Nguy cơ nhiễm mặn mùa khô']}]
PRODUCTS.forEach(p=>{p.sku='GS-'+String(p.id).padStart(3,'0')})
const IMG=n=>EXTRAS[n]?.img||''
POSTS.splice(0,POSTS.length,
{id:1,title:'Giải cứu cây cà chua héo sau 3 ngày quên tưới',cat:'Drama & Sửa sai',cover:IMG('Cà chua bi'),tags:['cây héo','vàng lá','cà chua'],related:[102,101],body:`## Chuyện gì đã xảy ra?
Mình đi công tác 3 ngày, về thấy cà chua rũ lá, đất nứt khô.
## 3 bước giải cứu
[[info:Tưới từ từ vào gốc, không dội mạnh|Che nắng 2 ngày đầu|Cắt lá héo, giữ bộ rễ]]
Sau 5 ngày cây ra lá mới (ảnh minh họa kéo trước/sau):
[[ba:${IMG('Cà chua bi')}|${IMG('Xà lách hữu cơ')}]]
Chuẩn bị sẵn dầu Neem và phân vi sinh để phục hồi:
[[product:102]]
[[product:101]]`},
{id:2,title:'Nhật ký 45 ngày nuôi cà chua bi trên ban công',cat:'Nhật ký & Thách thức',cover:IMG('Hoa hướng dương'),tags:['cà chua','nhật ký','nảy mầm'],related:[1,103],body:`## Ngày 1-7: nảy mầm
Gieo trong khay, che nắng 80%, phun sương sáng chiều. Ngày thứ 5 mầm nhú.
## Ngày 8-30: lớn nhanh
Bón phân vi sinh ngày 10 và 18, tỉa cây yếu.
[[gallery:${IMG('Cà chua bi')}|${IMG('Hoa hướng dương')}|${IMG('Xà lách hữu cơ')}]]
## Ngày 31-45: ra hoa
Cắm cọc, bấm ngọn. Cảnh báo: giai đoạn này dễ rụng hoa nếu thiếu nước.
[[product:1]]`},
{id:3,title:'Bóc phốt: hạt giống F1 chuẩn khác gì hạt bán tràn lan?',cat:'Bóc phốt & Sự thật',cover:IMG('Dưa hấu siêu ngọt'),tags:['hạt giống','F1','sâu bệnh'],related:[4,9],body:`## Bảng so sánh nhanh
[[table:Tiêu chí,Hạt F1 chuẩn,Hạt không rõ nguồn;Tỉ lệ nảy mầm,85-98%,Dưới 60%;Độ đồng đều,Cao,Thấp;Truy xuất nguồn gốc,Có mã SKU và lô,Không có]]
Mẹo kiểm tra: ngâm thử 10 hạt trong khăn ẩm, sau 5-7 ngày đếm số hạt nảy mầm.
[[info:Xem nhãn lô sản xuất|Thử nảy mầm trước khi gieo hàng loạt|Ưu tiên nơi bán có hướng dẫn kỹ thuật]]
[[product:9]]`},
{id:4,title:'Góc ban công chill: trồng cây xả stress sau giờ làm',cat:'Phong cách sống & Chill',cover:IMG('Cẩm tú cầu Nhật'),tags:['ban công','xả stress','thiết kế'],related:[104,106,10],body:`## Bố cục dễ làm
Giàn leo phía sau, khay rau ở giữa, chậu treo phía trước để tận dụng nắng.
[[gallery:${IMG('Cẩm tú cầu Nhật')}|${IMG('Sen đá đa sắc mix')}|${IMG('Dâu tây New Zealand')}]]
Mỗi tối dành 10 phút tưới nhẹ và ngắm cây giúp đầu óc thư giãn.
[[product:104]]
[[product:106]]`},
{id:5,title:'Bảng tính ROI: trồng rau ban công tiết kiệm bao nhiêu?',cat:'Bài toán Kinh tế',cover:IMG('Cà rốt baby Mỹ'),tags:['chi phí','rau sạch'],related:[3,105],body:`## Ước tính minh họa cho 3m²
[[table:Hạng mục,Chi phí (đ);Hạt giống,150.000;Đất và phân,200.000;Chậu và khay,100.000;Tổng ban đầu,450.000]]
Nếu mỗi tháng thu hoạch khoảng 3kg rau, bạn tiết kiệm xấp xỉ 120.000đ tiền mua rau, hoàn vốn sau 4-5 tháng (số liệu ước tính).
[[info:Chọn rau thu hoạch nhanh|Trồng gối vụ liên tục|Tự ủ phân từ rác bếp]]
[[product:105]]`},
{id:6,title:'Vỏ trứng, vỏ chuối, nước vo gạo: biến rác bếp thành phân bón',cat:'Mẹo Dân gian & Rác bếp',cover:IMG('Xà lách hữu cơ'),tags:['rụng hoa','vàng lá','mẹo dân gian'],related:[101,5],body:`## 3 công thức rác bếp
[[info:Nước vo gạo: pha loãng 1:1, tưới gốc 1 lần/tuần|Vỏ trứng: sấy khô, nghiền mịn, rắc quanh gốc|Vỏ chuối: ngâm 3 ngày, pha loãng để bổ sung Kali]]
Bổ sung Kali đúng lúc giúp hạn chế rụng hoa và vàng lá do thiếu dinh dưỡng.
[[product:101]]`})
