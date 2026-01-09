namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha',
        'anfitrion',
        'lugar',
        'invitados',
        'presupuesto',
        'extras'
    ];
}
