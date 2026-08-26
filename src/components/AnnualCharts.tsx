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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  INK,
  PINK,
  PINK_DEEP,
  PINK_SOFT,
  ageMix,
  brandCounts,
  categoryShareYears,
  genderShare,
  geoShare,
  marketWeight1404,
  otd,
  returnRates,
  skinShare,
  userGrowth,
} from "../data/annual-charts";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #ece7e3",
  borderRadius: 12,
  fontFamily: "Vazirmatn, Tahoma, sans-serif",
};

function formatFa(v: unknown) {
  return typeof v === "number" ? v.toLocaleString("fa-IR") : String(v ?? "");
}

function formatPct(v: unknown) {
  return typeof v === "number" ? `${v}٪` : String(v ?? "");
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <h3 className="mb-6 text-base md:text-lg font-bold text-ink">{title}</h3>
      <div className="h-[280px] md:h-[340px]">{children}</div>
    </div>
  );
}

export function UsersChart() {
  return (
    <ChartCard title="رشد کاربران یکتا از ۱۴۰۲ تا ۱۴۰۴">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={userGrowth}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} width={64} tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`} />
          <Tooltip contentStyle={tooltipStyle} formatter={formatFa} />
          <Line type="monotone" dataKey="users" name="کاربر" stroke={PINK} strokeWidth={3} dot={{ r: 5, fill: PINK }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryShareChart() {
  return (
    <ChartCard title="سهم از فروش ریالی هر گروه کالایی">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryShareYears}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis unit="%" tick={{ fontSize: 11 }} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="hygiene" name="بهداشتی" stackId="a" fill={PINK} />
          <Bar dataKey="health" name="سلامت" stackId="a" fill={PINK_DEEP} />
          <Bar dataKey="makeup" name="آرایشی" stackId="a" fill={PINK_SOFT} />
          <Bar dataKey="perfume" name="عطر" stackId="a" fill="#f4b6d8" />
          <Bar dataKey="electric" name="برقی" stackId="a" fill="#c9c4bf" />
          <Bar dataKey="gold" name="طلا" stackId="a" fill={INK} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const WEIGHT_COLORS = [PINK, PINK_DEEP, "#f4b6d8", "#c9c4bf", INK];

export function MarketWeightChart() {
  return (
    <ChartCard title="وزن بازار ۱۴۰۴">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={marketWeight1404} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92} paddingAngle={2}>
            {marketWeight1404.map((_, i) => (
              <Cell key={i} fill={WEIGHT_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={formatPct} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AgeChart() {
  return (
    <ChartCard title="ترکیب سنی مشتریان">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ageMix} layout="vertical" margin={{ right: 24 }}>
          <CartesianGrid stroke="#f0ecea" horizontal={false} />
          <XAxis type="number" unit="%" />
          <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="سهم" fill={PINK} radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GeoChart() {
  return (
    <ChartCard title="سهم تهران و سایر استان‌ها از سفارش">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={geoShare}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="tehran" name="تهران" fill={PINK} radius={[8, 8, 0, 0]} />
          <Bar dataKey="other" name="سایر استان‌ها" fill={PINK_SOFT} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BrandsChart() {
  return (
    <ChartCard title="تعداد برندهای فعال روی خانومی">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={brandCounts}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[900, 1500]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="brands" name="برند" stroke={PINK} strokeWidth={3} dot={{ r: 5, fill: PINK }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ReturnsChart() {
  return (
    <ChartCard title="نرخ مرجوعی کالا">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={returnRates}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis unit="٪" tick={{ fontSize: 11 }} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={formatPct} />
          <Line type="monotone" dataKey="rate" name="مرجوعی" stroke={PINK_DEEP} strokeWidth={3} dot={{ r: 5, fill: PINK_DEEP }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SkinShareChart() {
  return (
    <ChartCard title="سهم مراقبت پوست از ارزش فروش بازار زیبایی">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skinShare}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="market" tick={{ fontSize: 11 }} interval={0} />
          <YAxis unit="٪" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="share" name="سهم پوست" radius={[8, 8, 0, 0]}>
            {skinShare.map((_, i) => (
              <Cell key={i} fill={i === 1 ? PINK : PINK_SOFT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GenderChart() {
  return (
    <div className="grid gap-8">
      {genderShare.map((row) => {
        const isWomen = row.name === "زن";
        return (
          <div key={row.name} className="grid gap-3">
            <div className="flex items-end justify-between gap-4">
              <p className={`text-4xl font-extrabold ${isWomen ? "text-pink" : "text-ink"}`}>
                {row.value.toLocaleString("fa-IR")}٪
              </p>
              <p className="text-lg font-bold">{row.name}</p>
            </div>
            <div className="h-5 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full ${isWomen ? "bg-pink" : "bg-ink"}`}
                style={{ width: `${row.value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OtdChart() {
  return (
    <ChartCard title="شاخص ارسال به‌موقع (OTD)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={otd}>
          <CartesianGrid stroke="#f0ecea" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[80, 100]} unit="٪" />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="OTD" radius={[8, 8, 0, 0]}>
            {otd.map((_, i) => (
              <Cell key={i} fill={i === 1 ? PINK : PINK_SOFT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
