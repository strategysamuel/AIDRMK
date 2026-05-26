import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  image: string;
  rating: number;
  text: string;
}

const TestimonialCard = ({ name, image, rating, text }: TestimonialCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img src={image} alt={name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <h4 className="font-bold">{name}</h4>
            <div className="flex gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
