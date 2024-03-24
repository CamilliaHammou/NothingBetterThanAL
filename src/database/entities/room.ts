import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "room" })
export class Room {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column("text")
    images: string;

    @Column()
    type: string;

    @Column()
    capacity: number;

    @Column({ nullable: true })
    accessibility?: boolean;

    @Column({ default: false })
    maintenance: boolean;

    @Column("json", { nullable: true })
    schedule?: { date: string, movie: string }[];

    constructor(name: string, description: string, images: string, type: string, capacity: number, accessibility?: boolean, maintenance?: boolean, schedule?: { date: string, movie: string }[]) {
        this.name = name;
        this.description = description;
        this.images = images;
        this.type = type;
        this.capacity = capacity;
        this.accessibility = accessibility;
        this.maintenance = maintenance || false;
        this.schedule = schedule || [];
    }

    getImages(): string[] {
        return JSON.parse(this.images);
    }

    setImages(images: string[]): void {
        this.images = JSON.stringify(images);
    }
}
