import { Component, computed, input } from '@angular/core';
import {
  siGithub,
  siX,
  siBluesky,
  siInstagram,
  siTiktok,
  siItchdotio
} from 'simple-icons/icons';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.css',
})
export class Icon {
  name = input.required<string>();
  tooltip = input<string>();

  private icons: Record<string, any> = {
    github: siGithub,
    x: siX,
    bluesky: siBluesky,
    instagram: siInstagram,
    tiktok: siTiktok,
    itch: siItchdotio
  };

  icon = computed(() => this.icons[this.name()]);
}
