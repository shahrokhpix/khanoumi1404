import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PINK,
  PINK_DEEP,
  PINK_SOFT,
  categoryJump,
  categoryShare,
  contactTopics,
  dailyOrders,
  hourlyOrders,
  instagramVisits,
  keywordGrowth,
  lipstickVsAcne,
  makeupShift,
  pillSearch,
  provinceDrop,
  provinceShare,
  tehranRhythm,
  ukraineTrends,
  warVsAcne,
} from "../data/charts";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #ece7e3",
  borderRadius: 12,
  fontFamily: "IRANSans, Tahoma, sans-serif",
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <h3 className="mb-6 text-base md:text-lg font-bold text-ink">{title}</h3>
      <div className="h-[280px] md:h-[340px]">{children}</div>
    </div>
  );
}

export function DailyOrdersChart() {
  return (
    <ChartCard title="روند ثبت سفارش از خانومی در سال ۱۴۰۴">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dailyOrders}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend formatter={() => "روند سفارش روزانه"} />
          <Line type="monotone" dataKey="orders" stroke={PINK} strokeWidth={3} dot={{ r: 5, fill: PINK }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HourlyOrdersChart() {
  return (
    <ChartCard title="روند ثبت سفارش در ۲۴ ساعت یک روز عادی ۱۴۰۴">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={hourlyOrders}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
          <YAxis unit="%" tick={{ fontSize: 11 }} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend formatter={() => "سهم هر ساعت از سفارش‌های یک روز عادی"} />
          <Line type="monotone" dataKey="share" stroke={PINK} strokeWidth={3} dot={false} />
          <ReferenceLine x="12" stroke={PINK_DEEP} strokeDasharray="4 4" />
          <ReferenceLine x="18" stroke={PINK_DEEP} strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TehranChart() {
  return (
    <ChartCard title="ریتم ثبت سفارش استان تهران از خانومی در سال ۱۴۰۴">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={tehranRhythm}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis unit="%" tick={{ fontSize: 11 }} width={48} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="index" stroke={PINK} strokeWidth={3} dot={{ r: 4, fill: PINK }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function InstagramChart() {
  return (
    <ChartCard title="بازدید اینستاگرام خانومی‌شاپ در ۸۸ روز اختلال در برابر ۸۸ روز پیش از آن">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={instagramVisits}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="visits" radius={[12, 12, 0, 0]}>
            {instagramVisits.map((_, i) => (
              <Cell key={i} fill={i === 0 ? PINK : PINK_SOFT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ContactChart() {
  return (
    <ChartCard title="سهم هر موضوع از کل تماس‌های امور مشتریان در جنگ اول و جنگ دوم">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={contactTopics}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="topic" tick={{ fontSize: 11 }} interval={0} />
          <YAxis unit="%" tick={{ fontSize: 11 }} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="war1" name="جنگ اول" fill={PINK_SOFT} radius={[8, 8, 0, 0]} />
          <Bar dataKey="war2" name="جنگ دوم" fill={PINK} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PillSearchChart() {
  return (
    <ChartCard title="روند جست‌وجوی «قرص بی‌خیالی و ضد استرس» طی ۵ سال اخیر در گوگل ایران">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pillSearch}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke={PINK} strokeWidth={3} dot={{ r: 5, fill: PINK }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function WarAcneChart() {
  return (
    <ChartCard title="روند مقایسه‌ای سرچ «اخبار جنگ» و «جوش» در گوگل">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={warVsAcne}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="war" name="اخبار جنگ" stroke={PINK} strokeWidth={3} />
          <Line type="monotone" dataKey="acne" name="جوش" stroke={PINK_DEEP} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function KeywordChart() {
  return (
    <ChartCard title="رشد جست‌وجوی کلیدواژه‌های نگرانی از جنگ اول به جنگ دوم در پلتفرم خانومی">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={keywordGrowth} layout="vertical" margin={{ right: 24 }}>
          <CartesianGrid stroke="#f0ecea" horizontal={false} />
          <XAxis type="number" unit="%" />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="growth" fill={PINK} radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function LipstickChart() {
  return (
    <ChartCard title="ضروری‌تر از رژ لب: ضدجوش">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={lipstickVsAcne}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="period" />
          <YAxis unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="lipstick" name="رژ لب" fill={PINK_SOFT} radius={[8, 8, 0, 0]} />
          <Bar dataKey="acne" name="ضدجوش" fill={PINK_DEEP} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MakeupShiftChart() {
  return (
    <ChartCard title="بیشترین میزان تغییر در سبد آرایشی طی دو ماه جنگ دوم نسبت به دو ماه پیش از آن">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={makeupShift} layout="vertical" margin={{ right: 16 }}>
          <CartesianGrid stroke="#f0ecea" horizontal={false} />
          <XAxis type="number" unit="%" />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="change" radius={[0, 10, 10, 0]}>
            {makeupShift.map((row) => (
              <Cell key={row.name} fill={row.change >= 0 ? PINK : PINK_DEEP} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function UkraineChart() {
  return (
    <ChartCard title="رژ لب، عطر و اخبار جنگ در اوکراین">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ukraineTrends}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="news" name="اخبار جنگ / تهاجم" stroke={PINK} strokeWidth={3} />
          <Line type="monotone" dataKey="perfume" name="عطر" stroke={PINK_DEEP} strokeWidth={3} />
          <Line type="monotone" dataKey="lipstick" name="رژ لب" stroke={PINK_SOFT} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const PIE_COLORS = [PINK, PINK_SOFT, PINK_DEEP];

export function CategoryPies() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {categoryShare.map((row) => {
        const data = [
          { name: "مراقبتی", value: row.care },
          { name: "آرایشی", value: row.beauty },
          { name: "سایر", value: row.other },
        ];
        return (
          <div key={row.war} className="rounded-3xl border border-line p-4 md:p-6">
            <h3 className="mb-2 text-center font-bold whitespace-pre-line">{row.war}</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={88} paddingAngle={2}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CategoryJumpChart() {
  return (
    <ChartCard title="دسته‌هایی که بیشترین جهش فروش نسبت به مدت مشابه سال قبل را داشتند">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryJump}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="war1" name="بازه جنگ اول" fill={PINK_SOFT} radius={[8, 8, 0, 0]} />
          <Bar dataKey="war2" name="بازه جنگ دوم" fill={PINK} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ProvinceDropChart() {
  return (
    <ChartCard title="درصد افت دو استان پرفروش خانومی (تهران و اصفهان) نسبت به سال قبل">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={provinceDrop}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="war1" name="جنگ اول" fill={PINK_SOFT} radius={[8, 8, 0, 0]} />
          <Bar dataKey="war2" name="جنگ دوم" fill={PINK} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ProvinceShareChart() {
  return (
    <ChartCard title="۳ استان با بیشترین افت و ۳ استان با بیشترین رشد سهم (ارزش) در فروش طی جنگ دوم">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={provinceShare} layout="vertical" margin={{ right: 16 }}>
          <CartesianGrid stroke="#f0ecea" horizontal={false} />
          <XAxis type="number" unit="%" />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="change" radius={[0, 10, 10, 0]}>
            {provinceShare.map((row) => (
              <Cell key={row.name} fill={row.change >= 0 ? PINK : PINK_DEEP} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
